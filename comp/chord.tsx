import * as d3 from "d3"
import { FishLink } from "../elements/fishlink"
import { jsx } from "../jmx-lib/core"
import { Matrix } from "./linkstats"
import { mount } from "../utils/common"

export const ChordForType = ({ links }: { links: FishLink[] }) => {

    let sourcetypes = links.map(l => l.target.type).distinctBy()
    let targettypes = links.map(l => l.target.type).distinctBy()
    let linksbysource = links.groupBy(l => l.source.type ?? "")
    let matrixo: Matrix<any> = linksbysource.mapValues(links => links.groupBy(l => l.target.type))
    let alltypes = sourcetypes.concat(targettypes).distinctBy().sort() as string[]
    let matrix = alltypes.map(s => alltypes.map(t => matrixo[s][t]?.length ?? 0))
    mount({ matrix })

    function rund3(e: HTMLElement) {
        {
            console.log("chordy")

            // create the svg area
            var svg = d3.select(e)
                .append("svg")
                .attr("width", 440)
                .attr("height", 440)
                .append("g")
                .attr("transform", "translate(220,220)")

            // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
            var layout = d3.chord()
                .padAngle(0.05)     // padding between entities (black arc)
                //.sortSubgroups(d3.descending)
                (matrix)

            // add the groups on the inner part of the circle
            svg
                .datum(layout)
                .append("g")
                .selectAll("g")
                .data(function (d) { return d.groups; })
                .enter()
                .append("g")
                .append("path")
                .attr("class", d => alltypes[d.index])
                .style("stroke", "black")
                .attr("d", d3.arc().innerRadius(200).outerRadius(210) as unknown as string)

            // Add the links between groups
            svg
                .datum(layout)
                .append("g")
                .selectAll("path")
                .data(function (d) { return d; })
                .enter()
                .append("path")
                .attr("d", d3.ribbon().radius(200) as unknown as string)
                .style("fill", "#69b3aa")
                .style("stroke", "#555");
        }
    }

    return (
        <div>
            <div patch={rund3} />
            <b>chord</b>
        </div>)
}