import { Path } from '../analysis/path'
import { m } from '../app/model'
import { When, jsx } from '../jmx-lib/core'
import * as d3 from 'd3'
import { mount } from '../utils/common'
import { nodeColorScale } from '../utils/visuals'
import { NodeView } from './node-view'

export const HierarchyView = () => {
    console.log(m.graphfocus, m.graphfocusnode)

    return (
        <div id='graphview'>
            <div class='overlay'>
                <h2>hierarchy view!</h2>
                {m.graphfocusnode && <NodeView n={m.graphfocusnode} />}
            </div>
            <HierarchyGraphView />
        </div>
    )
}

function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
    }

    function dragged(event) {
        event.subject.fx = event.x
        event.subject.fy = event.y
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
    }

    return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
}

export function getPathsHierarchy() {
    let nd = new Map<string, any>()
    let fn = m.graphfocusnode!
    let root = {
        name: 'root',
        id: fn.id,
        children: [] as any,
    }
    for (let paths of fn.investigatePaths) {
        root.children.push(...paths.map(p => createpathhierarchy(nd, p)))
    }
    return root
}

function createpathhierarchy(nd: Map<string, any>, p: Path) {
    let nodes: string[] = p.links
        .flatMap(dl => dl.ends)
        .distinctBy()
        .toReversed()
        .slice(1)

    let head = null as any
    let h = head
    for (let n of nodes) {
        // let c = nd.ensure(n, () => {
        //     console.log("create", n)
        //     return ({ id: n })
        // })
        let c = { id: n }
        if (h) h.children = [c]
        h = c
        head ??= h
    }
    return head
}

function rund3(e) {
    if (!m.graphfocusnode) return

    let data = getPathsHierarchy()
    let root = d3.hierarchy(data)

    // color scheme for names
    let names = root
        .descendants()
        .map(n => n.data.id)
        .distinctBy()
    let nameColors = d3.scaleOrdinal().domain(names).range(d3.schemeSet1)

    const width = 1000

    // Compute the tree height; this approach will allow the height of the
    // SVG to scale according to the breadth (width) of the tree layout.
    const dx = 9
    const dy = width / (root.height + 1)

    // Create a tree layout.
    const layout = d3.cluster().nodeSize([dx, dy])

    // Sort the tree and apply the layout.
    root.sort((a, b) => d3.ascending(a.data.name, b.data.name))
    layout(root)

    // Compute the extent of the tree. Note that x and y are swapped here
    // because in the tree layout, x is the breadth, but when displayed, the
    // tree extends right rather than down.
    let x0 = Infinity
    let x1 = -x0
    root.each((d: any) => {
        if (d.x > x1) x1 = d.x
        if (d.x < x0) x0 = d.x
    })

    // Compute the adjusted height of the tree.
    const height = x1 - x0 + dx * 2

    mount({ m, data, root, layout, names, nameColors })

    const svg = d3
        .select(e)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [-dy / 3, x0 - dx, width, height])
        .attr('style', 'height: auto; font: 10px sans-serif;')

    const link = svg
        .append('g')
        .attr('fill', 'none')
        //.attr("stroke", "#555")
        .attr('class', 'link')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .selectAll()
        .data(root.links())
        .join('path')
        .attr('d', d3.linkHorizontal().x((d:any) => d.y).y((d: any) => d.x) as any)

    const node = svg
        .append('g')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .selectAll()
        .data(root.descendants())
        .join('g')
        .attr('transform', (d: any) => `translate(${d.y},${d.x})`)

    node.append('circle')
        .attr('fill', d => nameColors(d.data.id) as any)
        //.attr("fill", d => d.children ? "green" : "olive")
        .attr('r', 5)

    node.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => (d.children ? -6 : 6))
        .attr('text-anchor', d => (d.children ? 'end' : 'start'))
        .text(d => d.data.id)
        .clone(true)
        .lower()
        .attr('stroke', 'white')
}

const HierarchyGraphView = () => {
    return <div class='nodelink' patch={rund3} />
}
