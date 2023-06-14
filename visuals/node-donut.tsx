import * as d3 from '../lib/d3'
import { jsx } from 'jmx/core'
import { FishNode } from '../analysis/fishnode'

let linkTypeSortOrder = {
    partnership: 0,
    family_relationship: 1,
    membership: 2,
    ownership: 3,
}

export function NodeDonut({ n }: { n: FishNode }) {
    let data = (n.outlinks ?? [])
        ?.countBy(l => l.type)
        .entries.sortBy(([type, _]) => linkTypeSortOrder[type])
        .map(([type, value]) => ({ type, value }))

    console.log('DegreeDonut', n.id, data)

    function rund3(n) {
        const sum = data.sumBy(d => d.value)
        const radius = 15 + Math.sqrt(sum)

        const piedata = d3
            .pie()
            .sort(null)
            .padAngle(0.02)
            .value(x => x.value)(data)

        console.log(piedata)

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
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
        //.on('mouseover', (_, d) => console.log(d.data.type))
    }
    return <svg patch={rund3}></svg>
}
