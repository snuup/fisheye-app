import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { cc, mount, nidisplay } from '../utils/common'
import { FishNode } from '../elements/fishnode'
import { SuperLink, TypeCount } from '../elements/superlink'
import { d3nodedonut, getOuterRadius } from '../comp/node-donut'
import { c } from '../app/controller'
import { defsFilter } from '../assets/flags'
import * as f3 from '../force/index'

const strokeScaler = d3.scaleLinear([1, 2, 3, 4, 10, 1000], [1.5, 3, 4, 5, 6, 20])

const adornScaler = d3.scaleLinear([1, 2, 3, 10, 100], [4, 9, 12, 20, 50])

let simulation: any = null

type FishNodeForce = FishNode & { x: number, y: number, vx: number, vy: number }
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
    e ??= document.querySelector("article svg") as SVGElement
    let div = e.parentElement
    let width = div?.clientWidth!
    let height = div?.clientHeight!

    const angle = (d: FishLinkForce) => {
        let dx = (d.t.x - d.s.x)
        let dy = (d.t.y - d.s.y)
        return Math.atan2(dy, dx) * 180 / Math.PI
    }

    console.log("patch network!", m.netgraph, div?.clientWidth, div?.clientHeight)

    const svg = d3.select(e)

    let nodesm = m.netgraph.nodes.concat(m.majors).distinct() as unknown as FishNodeForce[]
    // we connect the links, so the link force does not need to do it
    let linksm = m.netgraph.links.map(l => new FishLinkForce(l, m.supergraph.getnode(l.source) as any, m.supergraph.getnode(l.target) as any))
    mount({ linksm, nodesm })
    //c.restorenetgraph()

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
            let isout = direction === "out"
            let radius = getOuterRadius(isout ? flf.source : flf.target)
            let totalsize = side.tcs.last.prevsum + side.tcs.last.count
            let dx = isout ? (radius + 10) : (radius + 10 + totalsize)
            return { ...side, radius, direction, flf, dx, totalsize, isout }
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
        .append('title')
        .text(d => `${d.tc.type} (${d.tc.count})`)

    linkadorns
        .append('path')
        .attr("d", d3.symbol(d3.symbolTriangle2))
        .attr('class', 'triangle')
        .attr('transform', ({ totalsize, isout }) => `translate(${isout ? totalsize + 13 : -13},0) rotate(${isout ? 90 : -90})`)

    nodesm.forEach(fn => {
        fn.x ??= width * Math.random()
        fn.y ??= height * Math.random()
    })

    let nodesv = svg
        .selectAll('g.node')
        .data(nodesm)
        .join('g')
        .on('mousedown', onnodeclick)

    function updatenodeclasses() {
        nodesv
            .attr('class', (n: FishNode) => cc(
                'node',
                n.role,
                n.type ?? "undefined",
                {
                    pinned: n.pinned,
                    selected: n.selected
                }))
    }

    updatenodeclasses()

    nodesv
        .append('g')
        .select(((n, i, nodes) => {
            d3nodedonut(d3.select(nodes[i]), n, true)
        }) as any)
        .attr('class', 'donut')
        .attr('transform', null) // clear transform and center the donut

    nodesv
        .append("text")
        .text(d => nidisplay(d.id))
        .attr('transform', d => `translate(0, ${getOuterRadius(d)})`)

    nodesv
        .attr('suspectdistance', n => n.suspectdistance ?? null)
        .filter(n => !!n.suspectdistance)
        .append("text")
        .text(n => " (" + n.suspectdistance + ")")
        .attr("class", "distance")
        .classed("hop1", n => n.suspectdistance == 1)
        .classed("hop2", n => n.suspectdistance == 2)

    console.log("simulation:")

    const distanceScaler = d3.scaleLinear([0, 1,    2,  3,  4, 5, 90],
                                          [0, 100, 80, 60, 30, 0,  0])

    function setxys() {
        let invid = 0
        let susid = 0
        nodesm.forEach(n => {
            if (n.pinned) {
                switch (n.role) {
                    case "inv":
                        n.xgreed = .4 * width
                        n.ygreed = height / 2
                        break
                    case "sus":
                        n.xgreed = .6 * width
                        n.ygreed = height / 2
                        break
                    default:
                        n.xgreed = width / 2
                        n.ygreed = height / 2
                }
            }
            else switch (n.role) {
                case "inv":
                    n.xgreed = 50
                    n.ygreed = 30 + invid++ * 30
                    break
                case "sus":
                    let d = n.suspectdistance ?? 0
                    let ds = distanceScaler(d)
                    n.xgreed = width - 50 - ds
                    n.ygreed = 10 + susid++ * 16
                    break
            }
        })
    }

    setxys()

    mount({ setxys })

    function xyforce(alpha) {
        const strength = .1
        nodesm.forEach((n) => {
            if (n.xgreed == undefined) return
            if (n.ygreed == undefined) return
            n.vx += (n.xgreed - n.x) * strength * alpha
            n.vy += (n.ygreed - n.y) * strength * alpha
        })
    }

    simulation =
        f3.forceSimulation(nodesm)
            //.alphaDecay(0.15)
            //.velocityDecay(.25)
            .force('many', d3.forceManyBody().strength(-10))
            .force('link', d3.forceLink(linksm).id((n: FishNodeForce) => n.id).distance(1).strength(.01))
            .force('collide', f3.forceCollide(80, nodesm))
            //.force('center', d3.forceCenter(width / 2, height / 2).strength(1))
            //.force('box', boxingForce)
            //.force("x", f3.forceX(100).x(n => n.home?.x ?? width / 2))
            //.force("y", f3.forceY(100).y(n => n.home?.y ?? height / 2))
            .force("home", xyforce)
            .on('tick', updateview)
            //.on('end', c.storenetgraph)

    svg.selectAll('g.node')
        .call(drag(simulation))

    function boxingForce(alpha) {
        for (let n of nodesm) {
            n.x = n.x.clamp(10, width)
            n.y = n.y.clamp(10, height)
        }
    }

    mount({ simulation })

    function updateview() {
        //  console.log('ontick')
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
        console.log("onnodeclick")

        if (ev.ctrlKey) {
            c.togglenetnode(ev, n)
            setxys()
            reheat()
            updatenodeclasses()
        }
        else if (ev.shiftKey) {
            c.selectnode(n)
        }
    }
    function reheat(alpha = 1) {
        simulation.alpha(alpha).restart()
    }

    mount({ reheat })

    const isdragable = (n: FishNode) => n.pinned || n.role == "inter"

    function drag(simulation) {

        function dragstarted(event, n: FishNode) {
            if (!isdragable(n)) return

            //if (event.sourceEvent.ctrlKey) return

            if (!event.active) simulation.alphaTarget(.2).restart()
            //event.subject.fx = event.sourceEvent.offsetX
            //event.subject.fy = event.sourceEvent.offsetY
        }

        function dragged(event, n) {
            if (!isdragable(n)) return
            event.subject.fx = event.sourceEvent.offsetX
            event.subject.fy = event.sourceEvent.offsetY
        }

        function dragended(event, n) {
            if (!isdragable(n)) return
            if (event.sourceEvent.ctrlKey) return
            if (!event.active) simulation.alphaTarget(0)
            if (event.sourceEvent.shiftKey) {
                event.subject.fx = null
                event.subject.fy = null
            }
            //c.storenetgraph()
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

mount({ ng: m.netgraph, rund3 })
