import * as d3 from '../lib/d3'
import { jsx } from "../jmx-lib/core"
import { FishNode } from '../analysis/fishnode'
import { identity } from '../utils/common'

let linkTypeSortOrder = {
    partnership: 0,
    family_relationship: 1,
    membership: 2,
    ownership: 3,
}

export function NodeDonut({ n }: { n: FishNode }) {
    let outcounts = n.outlinks?.countBy(l => l.type)
    let incounts = n.inlinks?.countBy(l => l.type)
    let data = Object.keys(linkTypeSortOrder).map(type => {
        let outs = outcounts?.[type] ?? 0
        let ins = incounts?.[type] ?? 0
        return { type, outs, ins, total: outs + ins }
    })

  //  console.log('data_', data)
  //  window.data = data

    // let data = (n.outlinks ?? [])
    //     ?.countBy(l => l.type)
    //     .entries.sortBy(([type, _]) => linkTypeSortOrder[type])
    //     .map(([type, value]) => ({ type, value }))

//    console.log('DegreeDonut', n.id, data)

    function rund3(n) {
        const sum = data.sumBy(d => d.total)
        //console.log(sum)

        const radius = 15 + Math.sqrt(sum)
        //console.log(radius)

        const piedata = d3
            .pie()
            .sort(null)

            .value(d => d.total)(data)


        let width = radius - 12

        const arc = d => {
            let portion
            let inner
            let outer
            let w
            if (d.ins) {
                portion = d.data.ins / d.value
                w = width * portion
                inner = 12
                outer = inner + w
            } else {
                portion = d.data.outs / d.value
                w = width * portion
                inner = radius - w
                outer = radius
            }

            return d3.arc()
                .innerRadius(inner)
                .outerRadius(outer)
                .cornerRadius(2.5)
                (d)
        }

        d3.select(n)
            .attr('width', radius * 2)
            .attr('height', radius * 2)
            .append('g')
            .attr('transform', `translate(${radius}, ${radius})`)

            .selectAll('g')
            .data(piedata)
            .join('g')
            .attr('class', d => d.data.type)

            .selectAll('path')
            .data(d => {
                //console.log('d', d)
                return [
                    d.data.outs && { ...d, outs: 1 },
                    d.data.ins && { ...d, ins: 1 },
                ].filter(identity)
            })
            .join('path')
            .attr('d', arc)
            .attr('class', d => (d.ins ? 'ins' : 'outs'))
            .style('stroke', '#eee')
            .style('stroke-width', '2.5px')
            .append('title')
            .text(d => d.data.type + (d.ins ? '<-' : '->'))
        //.attr('class', d => d.data.type)

        //.on('mouseover', (_, d) => console.log(d.data.type))
    }
    return <svg patch={rund3}></svg>
}
