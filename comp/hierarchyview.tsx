import { Path } from '../analysis/path'
import { m } from '../app/model'
import { When, jsx } from '../jmx-lib/core'
import * as d3 from '../lib/d3'
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

const HierarchyGraphView = () => {
    function rund3(e) {
        console.log('rund3 in hierarchyhview')
        let h = getPathHierarchy()
        console.log(h);

        return

        let svg = e.querySelector('svg')
    }

    return <div class='nodelink' patch={rund3} />
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

export function getPathHierarchy() {
    let fn = m.graphfocusnode!
    let root = {
        name: 'root',
        id: fn.id,
        children: [] as any,
    }
    for (let paths of fn.investigatePaths) {
        root.children.push(...paths.map(createpathhierarchy))
    }
    return root
}

export function createpathhierarchy(p: Path) {
    let nodes = p.links
        .flatMap(dl => dl.ends)
        .distinctBy()
        .toReversed()
        .slice(1)

    let head = null as any
    let h = head
    for (let n of nodes) {
        let c = { id: n }
        if (h) h.children = [c]
        h = c
        head ??= h
    }
    return head
}

mount({ getPathHierarchy, createpathhierarchy })
