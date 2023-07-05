import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { mount } from '../utils/common'
import { FishNode } from '../elements/fishnode'
import { SuperLink } from '../elements/superlink'

const radius = 8

const randscale = d3.scaleLinear([0, 1], [0, 100])
const rand100 = () => randscale(Math.random())

mount({ rand100 })

let simulation: any = null

type FishNodeForce = FishNode & { x: number, y: number, isinv: boolean }
type FishLinkForce = { l: SuperLink, source: string | any, target: string | any } // link-force will assign nodes to source and target

function rund3(e: SVGElement) {

    let div = e.parentElement
    let width = div?.clientWidth!
    let height = div?.clientHeight!
    const xscaler = d3.scaleLinear([0, 100], [0, width])
    const yscaler = d3.scaleLinear([0, 100], [0, height])

    console.log("patch network!", m.netgraph, div?.clientWidth, div?.clientHeight)

    const svg = d3
        .select(e)
    //.attr('viewBox', [0, 0, width, height])
    // .style('width', width)
    // .style('height', height)

    let nodesm = m.netgraph.nodes as unknown as FishNodeForce[] // .map(n => ({ n, id: n.id }))
    let linksm = m.netgraph.links.map(l => ({ l, source: l.source, target: l.target })) as FishLinkForce[]
    mount({ linksm, nodesm })

    const link = svg
        .selectAll('line')
        .data(linksm)
        .join(
            enter =>
                enter
                    .append('line')
                    .attr('class', fl => fl.l.type)
                    .attr('stroke-width', 2),
            //.attr('opacity', d => d.weight)
            //.on("click", e => c.selectlink(e.target.__data__)),
            update => update,

            exit => exit.remove()
        )

    nodesm.forEach(fn => {
        let isinv = m.investigatees.includes(fn.id)
        fn.x ??= rand100()
        fn.y ??= rand100()
        fn.isinv = isinv
    })

    let nodesv = svg
        .selectAll('g')
        .data(nodesm)
        .join('g')
        .classed('inv', fn => m.investigatees.includes(fn.id))
        .attr("class", fn => fn.type ?? "undefined")

    nodesv
        .append('circle')
        .attr('r', radius)
        .classed('inv', fn => m.investigatees.includes(fn.id))

    nodesv
        .append('text')
        .text(fn => fn.id)

    simulation = d3
        .forceSimulation(nodesm)
        //.stop()
        .force('many', d3.forceManyBody().strength(.001))
        .force('link', d3.forceLink(linksm).id((n: FishNodeForce) => n.id).distance(10).strength(.05))
        .force('collide', d3.forceCollide().radius(5).strength(1))
        .force('center', d3.forceCenter(50, 50).strength(.2))
        .force('box', boxingForce)
        .on('tick', updateview)

    svg.selectAll('g').call(drag(simulation))

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
        link.attr('x1', d => xscaler(d.source.x) as number)
            .attr('y1', d => yscaler(d.source.y) as number)
            .attr('x2', d => xscaler(d.target.x) as number)
            .attr('y2', d => yscaler(d.target.y) as number)
        //.style('opacity', d => opacityscaler(d.maxz))

        nodesv
            .attr('transform', (d: any) => `translate(${xscaler(d.x)},${yscaler(d.y)})`)
        //.attr('cx', d => xscaler(d.x))
        //.attr('cy', d => yscaler(d.y))
        //.style('opacity', d => opacityscaler(d.z))
    }

    updateview() // show random placements

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart()
            // event.subject.fx = xscaler.invert(event.sourceEvent.offsetX)
            // event.subject.fy = xscaler.invert(event.sourceEvent.offsetY)
        }

        function dragged(event) {
            event.subject.fx = xscaler.invert(event.sourceEvent.offsetX)
            event.subject.fy = yscaler.invert(event.sourceEvent.offsetY)
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0)
            if (event.sourceEvent.shiftKey) {
                event.subject.fx = null
                event.subject.fy = null
            }
        }

        return d3
            .drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
    }
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

mount({ ng: m.netgraph })

