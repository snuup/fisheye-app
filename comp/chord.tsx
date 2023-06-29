import * as d3 from "d3"
import { FishLink } from "../analysis/fishlink"
import { jsx } from "../jmx-lib/core"

export const ChordForType = ({ links }: { links: FishLink[] }) => {

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

            // create input data: a square matrix that provides flow between entities
            var matrix = [
                [90, 5, 5, 5],
                [10, 5, 5, 5],
                [10, 5, 5, 5],
                [10, 5, 5, 5]
            ];

            // give this matrix to d3.chord(): it will calculates all the info we need to draw arc and ribbon
            var res = d3.chord()
                .padAngle(0.05)     // padding between entities (black arc)
                .sortSubgroups(d3.descending)
                (matrix)

            // add the groups on the inner part of the circle
            svg
                .datum(res)
                .append("g")
                .selectAll("g")
                .data(function (d) { return d.groups; })
                .enter()
                .append("g")
                .append("path")
                .style("fill", "grey")
                .style("stroke", "black")
                .attr("d", d3.arc().innerRadius(200).outerRadius(210) as unknown as string)

            // Add the links between groups
            svg
                .datum(res)
                .append("g")
                .selectAll("path")
                .data(function (d) { return d; })
                .enter()
                .append("path")
                .attr("d", d3.ribbon().radius(200) as unknown as string)
                .style("fill", "#69b3aa")
                .style("stroke", "black");
        }
    }

    return (
        <div>
            <div patch={rund3} />
            <b>chord</b>
        </div>)
}