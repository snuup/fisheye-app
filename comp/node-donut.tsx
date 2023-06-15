import * as d3 from '../lib/d3'
import { jsx } from "../jmx-lib/core"
import { FishNode } from '../analysis/fishnode'
import { identity } from '../utils/common'

const linkTypeSortOrder = {
    partnership: 0,
    family_relationship: 1,
    membership: 2,
    ownership: 3,
}

const linktypes = Object.keys(linkTypeSortOrder)

export function NodeDonut({ n }: { n: FishNode }) {
    let outcounts = n.outlinks?.countBy(l => l.type)
    let incounts = n.inlinks?.countBy(l => l.type)
    let data = linktypes.map(type => {
        let outs = outcounts?.[type] ?? 0
        let ins = incounts?.[type] ?? 0
        return { type, outs, ins, total: outs + ins }
    })

    function rund3(n) {
        const sum = data.sumBy(d => d.total)
        const width = Math.sqrt(sum)
        const innerRadius = 10
        const outerRadius = innerRadius + width

        const piedata = d3
            .pie()
            .sort(null) // do *not* sort by value
            .value(d => d.total)(data)

        const arc = d => {
            let portion
            let inner
            let outer
            let w
            if (d.ins) {
                portion = d.data.ins / d.value
                w = width * portion
                //w = Math.min(10, w)
                inner = innerRadius - 0
                outer = innerRadius + w
            } else {
                portion = d.data.outs / d.value
                w = width * portion
                //w = Math.max(10, w)
                inner = outerRadius - w
                outer = outerRadius
            }

            return d3.arc()
                .innerRadius(inner)
                .outerRadius(outer)
                //.padAngle(.1)
                .cornerRadius(2.5)
                (d)
        }

        d3.select(n)
            .attr('width', outerRadius * 2)
            .attr('height', outerRadius * 2)
            .append('g')
            .attr('transform', `translate(${outerRadius}, ${outerRadius})`)

            .selectAll('g')
            .data(piedata)
            .join('g')
            .attr('class', d => d.data.type)

            .selectAll('path')
            .data(d => {
                //console.log('d', d)
                return [
                    d.data.outs && { ...d, outs: true },
                    d.data.ins && { ...d, ins: true },
                ].filter(identity)
            })
            .join('path')
            .attr('d', arc)
            .attr('class', d => (d.ins ? 'ins' : 'outs'))
            .style('stroke', '#eee')
            .style('stroke-width', '2.5px')
            .append('title')
            .text(d => {
                //console.log(d);

                return d.data.type + (d.ins ? `${d.data.ins} in` : `${d.data.outs} out`)
            })
        //.attr('class', d => d.data.type)

        //.on('mouseover', (_, d) => console.log(d.data.type))
    }
    return <svg patch={rund3}></svg>
}
