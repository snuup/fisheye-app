import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { mount } from '../utils/common'
import { FishNode } from '../elements/fishnode'
import { SuperLink } from '../elements/superlink'

const radius = 8
const width = 600
const height = 400

const xscaler = d3.scaleLinear([0, 100], [0, width])
const yscaler = d3.scaleLinear([0, 100], [0, height])

const randscale = d3.scaleLinear([0, 1], [0, 100])
const rand100 = () => randscale(Math.random())

mount({ rand100 })

let simulation: any = null

type FishNodeForce = { n: FishNode, x: number, y: number, isinv: boolean }
type FishLinkForce = { l: SuperLink, source: string | any, target: string | any } // link-force will assign nodes to source and target

function rund3(e: SVGElement) {

    console.log("patch network!", m.netgraph)

    const svg = d3
        .select(e)
        //.attr('class', 'xy')
        .attr('viewBox', [0, 0, width, height])
        .style('width', width)
        .style('height', height)

    let nodesm = m.netgraph.nodes.map(n => ({ n })) as FishNodeForce[]
    let linksm = m.netgraph.links.map(l => ({ l, source: l.source, target: l.target })) as FishLinkForce[]

    const link = svg
        .selectAll('.link')
        .data(linksm)
        .join(
            enter =>
                enter
                    .append('line')
                    .attr('class', 'link')
                    .attr('class', fl => fl.l.type)
                    .attr('stroke-width', 2)
                    .attr('fill', 'none'),
            //.attr('opacity', d => d.weight)
            //.on("click", e => c.selectlink(e.target.__data__)),
            update => update,

            exit => exit.remove()
        )

    nodesm.forEach(fn => {
        let isinv = m.investigatees.includes(fn.n.id)
        fn.x ??= rand100()
        fn.y ??= rand100()
        fn.isinv = isinv
    })

    let nodesv = svg
        .selectAll('g')
        .data(nodesm)
        .join('g')
        .classed('inv', fn => m.investigatees.includes(fn.n.id))

    nodesv
        .append('circle')
        .attr('r', radius)
        .classed('inv', fn => m.investigatees.includes(fn.n.id))

    nodesv
        .append('text')
        .text(fn => fn.n.id)
    //.classed('inv', d => m.investigatees.includes(d.id))

    simulation = d3
        .forceSimulation(nodesm)
        //.stop()
        .force('link', d3.forceLink(linksm).id((fn: FishNodeForce) => fn.n.id))
        .force('collide', d3.forceCollide().radius(30))
        .force('center', d3.forceCenter(50, 50).strength(0.1)) // x and y range = [0..100]
        .force('box', boxingForce)
        .on('tick', updateview)

    function boxingForce(alpha) {
        for (let n of nodesm) {
            n.x = n.x.clamp(2, 98)
            n.y = n.y.clamp(2, 98)
        }
    }

    mount({ simulation })

    function updateview() {
        console.log('ontick')
        for (let n of nodesm) {
            n.x = n.x.clamp(2, 98)
            n.y = n.y.clamp(2, 98)
        }
        // console.log(m.netgraph.nodes.map(n => n.y))
        link.attr('x1', d => xscaler(d.source.x))
            .attr('y1', d => yscaler(d.source.y))
            .attr('x2', d => xscaler(d.target.x))
            .attr('y2', d => yscaler(d.target.y))
        //.style('opacity', d => opacityscaler(d.maxz))

        nodesv
            .attr('transform', (d: any) => `translate(${xscaler(d.x)},${yscaler(d.y)})`)
        //.attr('cx', d => xscaler(d.x))
        //.attr('cy', d => yscaler(d.y))
        //.style('opacity', d => opacityscaler(d.z))
    }

    updateview() // show random placements

    mount({ simulation, updateview })
}

export const Network = () => {
    return (
        <div class='net-graph'  >
            <svg patch={rund3}></svg>
        </div>
    )
}

// function reheat() {
//     simulation.alpha(0.5)
//     simulation.restart()
// }

// function printnodesxy() {
//     for (let n of m.netgraph.nodes) {
//         console.log(n.id, n.x, n.y)
//     }
// }

mount({ ng: m.netgraph, xscaler, yscaler })

