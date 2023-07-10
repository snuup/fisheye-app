import { jsx } from "../jmx-lib/core"
import * as d3 from "d3"
import { FishLink } from "../elements/fishlink"
import { cc, makekv, mount } from "../utils/common"
import { mc1 } from "../data/data"

export const NodeIdBarChart = () => {

    function rund3(e: HTMLElement) {

        console.log("run barchart d3")

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

        // layout
        let div = e.parentElement as HTMLDivElement

        let margin = { top: 0, right: 0, bottom: 0, left: 0 },
            width = div.clientWidth - margin.left - margin.right,
            height = div.clientHeight - margin.top - margin.bottom

        let svg = d3.select(e)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("overflow", "visible")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        mount({ stats })

        // x axis
        let x = d3.scaleLinear()
            .domain([0, stats.total])
            .range([0, width])

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")

        // y axis
        let y = d3.scaleBand()
            .range([0, height])
            .domain(stats.keys)
            .padding(.1)

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).tickSize(0))

        mount({ x, y })

        // bars
        svg.selectAll('rect')
            .data(Object.entries(stats).map(makekv))
            .join('rect')
            .attr("x", x(0))
            .attr("y", (({ key }) => y(key)!))
            .attr("width", ({ value }) => x(value)!)
            .attr("height", y.bandwidth())
            .attr("fill", "#777") // default fill
            .attr("class", ({ key }) => cc("bar", key))
            .append("title")
            .text()
    }
    return (
        <div class="nodeid-bars" >
            <svg patch={rund3}></svg>
        </div>
    )
}
