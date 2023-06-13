import { mount } from 'jmx/util/common'
import * as d3 from '../lib/d3'
import { jsx, patch } from 'jmx/core'

export function run_() {
    const data = [
        { type: 'a', value: 50 },
        { type: 'b', value: 20 },
        { type: 'c', value: 30 },
    ]

    const width = 450,
        height = 450

    const radius = Math.min(width, height) / 2

    const svg = d3
        .select(document.body)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)

    const piedata = d3.pie().value(x => x.value)(data)

    svg.selectAll('g.path')
        .data(piedata)
        .join('path')
        .attr('d', d3.arc().innerRadius(80).outerRadius(radius))
        .attr('class', d => d.data.type)
}

export function Pie({ data }) {
    const width = 100,
        height = 100

    function patch(n) {

        const radius = Math.min(width, height) / 2
        console.log(radius);

        const svg = d3
            .select(n)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${radius}, ${radius})`)

        console.log(n.outerHTML)

        const piedata = d3.pie().value(x => x.value)(data)

        console.log(piedata)

        svg.selectAll('g.path')
            .data(piedata)
            .join('path')
            .attr('d', d3.arc().innerRadius(25).outerRadius(radius))
            .attr('class', d => d.data.type)
    }
    return <svg patch={patch}></svg>
}

const data = [
    { type: 'a', value: 50 },
    { type: 'b', value: 20 },
    { type: 'c', value: 30 },
]

export function run() {
    patch(document.body, <body><Pie data={data} /></body>)
}

mount({ run })
