import * as d3 from '../lib/d3'
import { jsx } from "../jmx-lib/core"
import { FishNode } from '../analysis/fishnode'
import { identity, mount } from '../utils/common'

const linkTypeSortOrder = {
    partnership: 0,
    family_relationship: 1,
    membership: 2,
    ownership: 3,
}

const linktypes = Object.keys(linkTypeSortOrder)

interface NodeLinkData {
    type: string,
    outs: number,
    ins: number,
    total: number
}

export function NodeDonut({ n }: { n: NodeLinkData[] | FishNode }) {

    let data: NodeLinkData[]
    if (n instanceof FishNode) {
        let outcounts = n.outlinks?.countBy(l => l.type)
        let incounts = n.inlinks?.countBy(l => l.type)
        data = linktypes.map(type => {
            let outs = outcounts?.[type] ?? 0
            let ins = incounts?.[type] ?? 0
            return { type, outs, ins, total: outs + ins }
        })
    }
    else {
        data = n
    }

    const sum = data.sumBy(d => d.total)

    let widthScale = d3.scaleSqrt([0, 300], [5, 20])

    //const width = Math.sqrt(sum)
    const innerRadius = 10
    const outerRadius = innerRadius + widthScale(sum)
    const scaleRadius = d3.scaleLinear().range([innerRadius, outerRadius])

    function rund3(n) {

        const piedata = d3
            .pie()
            .sort(null) // do *not* sort by value
            .value(d => d.total)(data)

        const arc = d => {
            const midRadius = scaleRadius(d.data.ins / d.value)
            let [inner, outer] = d.ins ? [innerRadius, midRadius] : [midRadius, outerRadius]

            return d3.arc()
                .innerRadius(inner)
                .outerRadius(outer)
                //.padAngle(.05)
                //.cornerRadius(2)
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
            .style('stroke-width', '2px')
            .append('title')
            .text(d => {
                return d.data.type + (d.ins ? `${d.data.ins} in` : `${d.data.outs} out`)
            })
        //.attr('class', d => d.data.type)

        //.on('mouseover', (_, d) => console.log(d.data.type))
    }
    return <svg patch={rund3}></svg>
}

mount({ d3 })