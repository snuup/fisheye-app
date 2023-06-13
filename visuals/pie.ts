import { mount } from "jmx/util/common"
import * as d3 from "../lib/d3"

export function run() {

    const data = [
        { type: "a", value: 50 },
        { type: "b", value: 20 },
        { type: "c", value: 30 }
    ]

    const width = 450,
        height = 450

    const radius = Math.min(width, height) / 2

    const svg = d3.select(document.body)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)

    const piedata = d3.pie().value(x => x.value)(data)

    svg
        .selectAll('g.path')
        .data(piedata)
        .join('path')
        .attr('d', d3.arc()
            .innerRadius(80)
            .outerRadius(radius)
        )
        .attr("class", d => d.data.type)
}

mount({ run })