import * as d3 from 'd3'
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

//export function NodeDonut({ n }: { n: NodeLinkData[] | FishNode }) {
export function NodeDonut({ n }: { n: FishNode }) {

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
    let widthScale = d3.scaleSqrt([0, 300], [5, 22])
    const innerRadius = 10
    const outerRadius = innerRadius + widthScale(sum)
    const scaleRadius = d3.scaleLinear().range([innerRadius, outerRadius])

    function rund3(element) {

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

        const g =

            d3.select(element)
                .attr('width', outerRadius * 2)
                .attr('height', outerRadius * 2)
                .append('g')
                .attr('transform', `translate(${outerRadius}, ${outerRadius})`)

        addIcon(g, outerRadius, n.type)

        g
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

function addIcon(g, outerRadius, name) {
    let icon = icons[name]
    if (!icon) return
    g
        .append("svg")
        .attr("viewBox", icon.viewBox)
        .attr('height', '1em')
        .attr('x', -outerRadius)
        .attr('y', "-.5em") // why this value ?
        .append('path').attr('d', icon.d)
        .style('fill', '#555')
}

const icons = {
    person: {
        viewBox: "0 0 320 512",
        d: "M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z"
    },
    company: {
        viewBox: "0 0 384 512",
        d: "M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z"
    },
    organization: {
        viewBox: "0 0 576 512",
        d: "M208 80c0-26.5 21.5-48 48-48h64c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48h-8v40H464c30.9 0 56 25.1 56 56v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H464c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-4.4-3.6-8-8-8H312v40h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H256c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V280H112c-4.4 0-8 3.6-8 8v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-30.9 25.1-56 56-56H264V192h-8c-26.5 0-48-21.5-48-48V80z"
    },
    'political-organization': {
        viewBox: "0 0 512 512",
        d: "M240.1 4.2c9.8-5.6 21.9-5.6 31.8 0l171.8 98.1L448 104l0 .9 47.9 27.4c12.6 7.2 18.8 22 15.1 36s-16.4 23.8-30.9 23.8H32c-14.5 0-27.2-9.8-30.9-23.8s2.5-28.8 15.1-36L64 104.9V104l4.4-1.6L240.1 4.2zM64 224h64V416h40V224h64V416h48V224h64V416h40V224h64V420.3c.6 .3 1.2 .7 1.8 1.1l48 32c11.7 7.8 17 22.4 12.9 35.9S494.1 512 480 512H32c-14.1 0-26.5-9.2-30.6-22.7s1.1-28.1 12.9-35.9l48-32c.6-.4 1.2-.7 1.8-1.1V224z"
    }
}

mount({ d3 })