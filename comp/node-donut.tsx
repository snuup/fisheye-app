import * as d3 from 'd3'
import { jsx } from "../jmx-lib/core"
import { FishNode } from '../elements/fishnode'
import { identity, mount } from '../utils/common'
import '../assets/flags'
import { flag } from '../assets/flags'
import { m } from '../app/model'

const innerRadius = 10
let donutOuterRadiusScaler = d3.scaleSqrt([0, 300], [innerRadius + 5, innerRadius + 22])

export const getOuterRadius = (n: FishNode) => donutOuterRadiusScaler(n.degree)

export function d3nodedonut(sel, n: FishNode, undirected, addtext) {

    let shortname = n.id.slice(0, 10)

    let donut = undirected ? n.donut.map(n => ({ ...n, ins: 0, outs: n.total })) : n.donut

    const outerRadius = getOuterRadius(n)
    const scaleMidRadius = d3.scaleLinear().range([innerRadius, outerRadius])

    const piedata = d3
        .pie()
        .sort(null) // do *not* sort by value
        .value((d: any) => d.total)(donut as any)

    const arc = d => {
        const midRadius = scaleMidRadius(d.data.ins / d.value)
        let [inner, outer] = d.ins ? [innerRadius, midRadius] : [midRadius, outerRadius]

        return d3.arc()
            .innerRadius(inner)
            .outerRadius(outer)
            //.padAngle(.05)
            //.cornerRadius(2)
            (d)
    }

    const g =

        sel
            .attr('width', outerRadius * 2)
            .attr('height', outerRadius * 2)
            .append('g')
            .attr("class", "donut")
            .classed('inv', m.invs.includes(n))
            .classed('suspect', m.suspects.includes(n))
            .attr('transform', `translate(${outerRadius}, ${outerRadius})`)

    g.append('circle').attr("r", outerRadius).attr("class", "bgcircle")



    g
        .selectAll('g')
        .data(piedata)
        .join('g')
        .attr('class', (d: any) => d.data.type)

        .selectAll('path')
        .data((d: any) => {
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

    addIcon(g, outerRadius, n.type)

    // if (addtext) {
    //     // let t =
    //     //     g
    //     //         .append('g')
    //     //         .attr('class', 'text-container')
    //     //         .attr('transform', `translate(0,${outerRadius + 5})`)
    //     let t =
    //         g
    //         .append('text')
    //         .text(shortname)
    //         .attr("filter", "url(#solid)")
    //     t
    //         .append('text')
    //         .text(shortname)
    // }

    g
        .append('g')
        .attr('transform', `translate(${outerRadius},${-outerRadius * .8})`)
        .append(d => n.country ? flag(m.countryColorScaler(n.country)) : document.createElement('i'))
        .append('title')
        .text(n.country)

    return g
}

export function NodeDonut({ n }: { n: FishNode }) {
    return <svg patch={e => d3nodedonut(d3.select(e), n, false, false)}></svg>
}

function addIcon(g, outerRadius, name) {
    let icon = icons[name]
    if (!icon) return
    g
        .append('path').attr('d', icon)
        .attr('class', "icon " + name)
}

const icons = {
    person: "M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z",
    company: "M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z",
    organization: "M208 80c0-26.5 21.5-48 48-48h64c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48h-8v40H464c30.9 0 56 25.1 56 56v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H464c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-4.4-3.6-8-8-8H312v40h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H256c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V280H112c-4.4 0-8 3.6-8 8v32h8c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V368c0-26.5 21.5-48 48-48h8V288c0-30.9 25.1-56 56-56H264V192h-8c-26.5 0-48-21.5-48-48V80z",
    'political-organization': "M240.1 4.2c9.8-5.6 21.9-5.6 31.8 0l171.8 98.1L448 104l0 .9 47.9 27.4c12.6 7.2 18.8 22 15.1 36s-16.4 23.8-30.9 23.8H32c-14.5 0-27.2-9.8-30.9-23.8s2.5-28.8 15.1-36L64 104.9V104l4.4-1.6L240.1 4.2zM64 224h64V416h40V224h64V416h48V224h64V416h40V224h64V420.3c.6 .3 1.2 .7 1.8 1.1l48 32c11.7 7.8 17 22.4 12.9 35.9S494.1 512 480 512H32c-14.1 0-26.5-9.2-30.6-22.7s1.1-28.1 12.9-35.9l48-32c.6-.4 1.2-.7 1.8-1.1V224z",
    vessel: "M256 16c0-7 4.5-13.2 11.2-15.3s13.9 .4 17.9 6.1l224 320c3.4 4.9 3.8 11.3 1.1 16.6s-8.2 8.6-14.2 8.6H272c-8.8 0-16-7.2-16-16V16zM212.1 96.5c7 1.9 11.9 8.2 11.9 15.5V336c0 8.8-7.2 16-16 16H80c-5.7 0-11-3-13.8-8s-2.9-11-.1-16l128-224c3.6-6.3 11-9.4 18-7.5zM5.7 404.3C2.8 394.1 10.5 384 21.1 384H554.9c10.6 0 18.3 10.1 15.4 20.3l-4 14.3C550.7 473.9 500.4 512 443 512H133C75.6 512 25.3 473.9 9.7 418.7l-4-14.3z",
    location: "M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z",
    event: "M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z",
    movement: "M438.6 150.6c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.7 96 32 96C14.3 96 0 110.3 0 128s14.3 32 32 32l306.7 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96zm-333.3 352c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 416 416 416c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96z"
}

mount({ d3 })