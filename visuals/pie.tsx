import { mount } from 'jmx/util/common'
import * as d3 from '../lib/d3'
import { jsx, patch } from 'jmx/core'

//import d3 from 'd3'
//let z = d3.version

export function Donut({ data }: { data: { type: string; value: number }[] }) {
    function patch(n) {
        const sum = data.sumBy(d => d.value)
        const radius = 15 + Math.sqrt(sum)
        // console.log(radius, sum, (radius * radius - 15 * 15) / sum)

        const piedata = d3.pie().padAngle(0.02).value(x => x.value)(data)

        d3.select(n)
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .append('g')
            .attr('transform', `translate(${radius}, ${radius})`)
            .selectAll('g.path')
            .data(piedata)
            .join('path')
            .attr('d', d3.arc().innerRadius(12).outerRadius(radius))
            .attr('class', d => d.data.type)
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .on("mouseover", (_,d) => console.log(d.data.type))
    }
    return <svg patch={patch}></svg>
}

const data = [
    { type: 'a', value: 50 },
    { type: 'b', value: 20 },
    { type: 'c', value: 30 },
]

const data2 = [
    { type: 'a', value: 30 },
    { type: 'b', value: 12 },
    { type: 'c', value: 5 },
    { type: 'd', value: 27 },
]

const data3 = [
    { type: 'a', value: 5 },
    { type: 'b', value: 4 },
]

export function run() {
    patch(
        document.body,
        <body>
            <Donut data={data} />
            <Donut data={data2} />
            <Donut data={data3} />
        </body>
    )
}

mount({ run })
