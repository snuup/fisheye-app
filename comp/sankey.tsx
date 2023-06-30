import * as d3 from "d3"
import * as d3s from 'd3-sankey'
import { FishLink } from "../analysis/fishlink"
import { jsx } from "../jmx-lib/core"
import { mount } from "../utils/common"

class SourceNode implements FlowNode {
    id: string
    constructor(id) { this.id = id }
    get flowid() { return "s" + this.id }
}

class TargetNode implements FlowNode {
    id: string
    constructor(id) { this.id = id }
    get flowid() { return "t" + this.id }
}

interface FlowNode {
    get id(): string
    get flowid(): string
}

class FlowLink {
    source: string
    target: string
    constructor(public _source, public _target, public value) {
        this.source = "s" + this._source
        this.target = "t" + this._target
    }
}

export const SankeyForType = ({ links }: { links: FishLink[] }) => {

    let sourcetypes = links.map(l => l.target.type).distinctBy()
    let targettypes = links.map(l => l.target.type).distinctBy()
    let alltypes =
        sourcetypes
            .concat(targettypes)
            .distinctBy()
            .map(s => s ?? "undefined")
            .sort() as string[]

    let linksbysource = links.groupBy(l => l.source.type)

    let flownodes: FlowNode[] = alltypes.flatMap(t => [new SourceNode(t), new TargetNode(t)])

    let flowlinks: FlowLink[] = []
    for (let source in linksbysource) {
        let linksbytarget = linksbysource[source].groupBy(l => l.target.type)
        for (let target in linksbytarget) {
            flowlinks.push(new FlowLink(source, target, linksbytarget[target]?.length ?? 0))
        }
    }

    const width = 500
    const height = 300

    function rund3(e: HTMLElement) {
        {
            const layout = d3s.sankey<FlowNode, any>()
                .nodeId(d => d.flowid)
                .nodeWidth(15)
                .nodePadding(20)
                .extent([[1, 10], [width, height + 20]])

            let { nodes, links } = layout({
                nodes: flownodes,
                links: flowlinks
            })

            const svg = d3
                .select(e)
                .append("svg")
                .attr("viewBox", [0, 0, width, height])

            svg.append("g")
                .attr("stroke", "#000")
                .selectAll("rect")
                .data(nodes)
                .join("rect")
                .attr("x", d => d.x0!)
                .attr("y", d => d.y0!)
                .attr("height", d => d.y1! - d.y0!)
                .attr("width", d => d.x1! - d.x0!)
                .attr("class", d => d.id)
                .append("title")
                .text(d => d.id)

            const link = svg.append("g")
                .attr("fill", "none")
                .attr("stroke-opacity", 0.5)
                .selectAll("g")
                .data(links)
                .join("g")
                .style("mix-blend-mode", "multiply")

            link.append("path")
                .attr("d", d3s.sankeyLinkHorizontal())
                .attr("stroke", 'black')
                .attr("stroke-width", d => Math.max(1, d.width))

            link.append("title")
                .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`)

            svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .selectAll("text")
                .data(nodes)
                .join("text")
                .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
                .attr("y", d => (d.y1 + d.y0) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
                .text(d => d.id)
        }
    }

    return <div patch={rund3} />
}