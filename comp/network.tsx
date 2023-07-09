import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { cc, mount } from '../utils/common'
import { FishNode } from '../elements/fishnode'
import { SuperLink, TypeCount } from '../elements/superlink'
import { d3nodedonut, getOuterRadius } from './node-donut'
import { c } from '../app/controller'
import { defsFilter } from '../assets/flags'

const strokeScaler = d3.scaleLinear([1, 2, 3, 4, 10, 1000], [1.5, 3, 5, 6, 8, 20])

let simulation: any = null

type FishNodeForce = FishNode & { x: number, y: number, isinv: boolean }
class FishLinkForce {
    constructor(public l: SuperLink, public source: FishNodeForce, public target: FishNodeForce) { }
    get s() { return this.source }
    get t() { return this.target }
    get dx() { return this.t.x - this.s.x }
    get dy() { return this.t.y - this.s.y }
    get length() { return Math.sqrt(this.dx * this.dx + this.dy * this.dy) }
    get sourceOuterRadius() { return getOuterRadius(this.source) }
    get targetOuterRadius() { return getOuterRadius(this.target) }
}

function rund3(e: SVGElement) {

    let div = e.parentElement
    let width = div?.clientWidth!
    let height = div?.clientHeight!

    const angle = (d: FishLinkForce) => {
        let dx = (d.t.x - d.s.x)
        let dy = (d.t.y - d.s.y)
        return Math.atan2(dy, dx) * 180 / Math.PI
    }

    console.log("patch network!", m.netgraph, div?.clientWidth, div?.clientHeight)

    const svg = d3
        .select(e)
        .on('click', c.resethighlights)
    // .attr('viewBox', [0, 0, width, height])
    // .style('width', width)
    // .style('height', height)

    let nodesm = m.netgraph.nodes as unknown as FishNodeForce[] // .map(n => ({ n, id: n.id }))
    let linksm = m.netgraph.links.map(l => new FishLinkForce(l, m.netgraph.getnode(l.source) as any, m.netgraph.getnode(l.target) as any))
    mount({ linksm, nodesm })
    c.restorenetgraph()

    const linkg = svg
        .selectAll('g.line')
        .data(linksm)
        .join('g')
        .attr('class', d => cc(d.l.type, ' line', { highlight: d.l.highlight }))

    let link =
        linkg
            .append('line')
            .attr('stroke-width', (fl: FishLinkForce) => strokeScaler(fl.l.links.length))
            .on('mousedown', (ev, { l }) => console.log(l))

    const computeAdornSides = (flf: FishLinkForce) => {

        return flf.l.typeCountsPerSide.map(side => {
            let t = side.tcs.first
            let direction = t.direction
            let radius = getOuterRadius(direction === "out" ? flf.source : flf.target)
            let dx = direction === "out" ? (radius + 5) : (radius + side.tcs.last.prevsum + side.tcs.last.countpos + 5)
            return { ...side, radius, direction, flf, dx }
        })
    }

    let linkadorns =
        linkg
            .selectAll('g.linkadorns')
            .data(computeAdornSides)
            .join('g')
            .attr('class', d => cc('linkadorns', d.direction))

    linkadorns
        .selectAll('rect.linkadorn')
        .data(side => side.tcs.map(tc => ({ ...side, tc })))
        .join('rect')
        .attr('x', ({ tc, radius }) => tc.prevsum)
        .attr('y', -5)
        .attr('class', ({ tc }) => cc('linkadorn', tc.direction, tc.type))
        .attr('width', ({ tc }) => tc.countpos)
        .attr('height', 10)

    // linkg
    //     .selectAll('path.arrows')
    //     .data(d => d.l.arrows) // MUST NOT destruct flf !
    //     .join('path')
    //     .attr("d", d3.symbol(d3.symbolTriangle2))
    //     .attr('direction', d => d.direction)

    nodesm.forEach(fn => {
        let isinv = m.investigatees.includes(fn.id)
        fn.x ??= width * Math.random()
        fn.y ??= height * Math.random()
        fn.isinv = isinv
    })

    let nodesv = svg
        .selectAll('g.node')
        .data(nodesm)
        .join('g')
        .attr('class', n => cc(
            'node',
            m.investigatees.includes(n.id) && 'inv', n.type ?? "undefined",
            {
                highlight: n.highlight,
                focused: n.focused
            }))
        .on('mousedown', onnodeclick)

    nodesv
        .append('svg')
        .attr("class", "net-donut")
        .select(((n, i, nodes) => {
            d3nodedonut(d3.select(nodes[i]), n, true, true)
        }) as any)

    simulation = d3
        .forceSimulation(nodesm)
        //.alphaDecay(0.5)
        //.velocityDecay(.5)
        //.force('many', d3.forceManyBody().strength(-10))
        .force('link', d3.forceLink(linksm).id((n: FishNodeForce) => n.id).distance(1).strength(.01))
        .force('collide', d3.forceCollide().radius(25).strength(1))
        //.force('center', d3.forceCenter(width / 2, height / 2).strength(1))
        //.force('box', boxingForce)
        .on('tick', updateview)
        .on('end', c.storenetgraph)

    svg.selectAll('g.node').call(drag(simulation))

    function boxingForce(alpha) {
        for (let n of nodesm) {
            n.x = n.x.clamp(10, width)
            n.y = n.y.clamp(10, height)
        }
    }

    mount({ simulation })

    function updateview() {
        console.log('ontick')
        for (let n of nodesm) {
            n.x = n.x.clamp(2, width)
            n.y = n.y.clamp(2, height)
        }

        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)

        linkadorns
            .attr('transform',
            ({ flf, dx, direction }) => `translate(${(flf.source.x)},${(flf.source.y)}) rotate(${angle(flf)}) translate(${direction === "out" ? dx : flf.length - dx},0)`)

        nodesv
            .attr('transform', (d: any) => `translate(${(d.x)},${(d.y)})`)
    }

    updateview() // show random placements

    function onnodeclick(ev: MouseEvent, n: FishNode) {
        if (ev.ctrlKey) {
            c.highlightbadpaths(n)
            return
        }
        c.resethighlights()
        // if (ev.ctrlKey) {
        //     c.togglenetnode(ev, n)
        // }
    }

    function drag(simulation) {
        function dragstarted(event) {
            //if (event.sourceEvent.ctrlKey) return

            if (!event.active) simulation.alphaTarget(.2).restart()
            //event.subject.fx = event.sourceEvent.offsetX
            //event.subject.fy = event.sourceEvent.offsetY
        }

        function dragged(event) {
            event.subject.fx = event.sourceEvent.offsetX
            event.subject.fy = event.sourceEvent.offsetY
        }

        function dragended(event) {
            if (event.sourceEvent.ctrlKey) return
            if (!event.active) simulation.alphaTarget(0)
            if (event.sourceEvent.shiftKey) {
                event.subject.fx = null
                event.subject.fy = null
            }
            c.storenetgraph()
        }

        return d3
            .drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
    }

    svg.node()?.append(defsFilter!)
}

export const Network = () => {
    return (
        <div class='net-graph'  >
            <svg patch={rund3}></svg>
        </div>
    )
}

mount({ ng: m.netgraph })

