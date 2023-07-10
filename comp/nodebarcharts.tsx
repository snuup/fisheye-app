import { jsx } from "../jmx-lib/core"
import * as d3 from "d3"
import { FishLink } from "../elements/fishlink"
import { mount } from "../utils/common"
import { mc1 } from "../data/data"

export const NodeIdBarChart = () => {

    function rund3(e: HTMLElement) {

        // data
        let o: { country: number, id: number, type: number } = mc1.nodes.flatMap(n => n.keys).countBy()
        delete (o as any).donut
        let stats =
        {
            total: mc1.nodes.length as number,
            id: o.id,
            type: o.type,
            country: o.country
        }

        let margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        let svg = d3.select(e)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("overflow", "visible")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        mount({ stats })

        // Add X axis
        let x = d3.scaleLinear()
            .domain([0, stats.total])
            .range([0, width])

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")

        // Y axis
        let y = d3.scaleBand()
            .range([0, height])
            .domain(stats.keys)
            .padding(.1)

        svg.append("g")
            .call(d3.axisLeft(y))

        mount({ x, y })

        //Bars
        svg.selectAll('rect')
            .data(stats.entries as [string, number][])
            .join('rect')
            .attr("x", x(0))
            .attr("y", ([k, v]) => y(k)!)
            .attr("width", ([k, v]) => x(v)!)
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2")
    }
    return (
        <div class="nodeid-bars" >
            <svg patch={rund3}></svg>
        </div>
    )
}
