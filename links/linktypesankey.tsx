import * as d3 from "d3"
import * as d3s from 'd3-sankey'
import { jsx } from "../jmx-lib/core"
import { m } from "../app/model"
import { LinkController } from "./linkcontroller"
import { cc } from "../utils/common"
import { getlinkgroupkey, nodetypes, splitconnects } from "../analysis/common"

abstract class FlowNode {

    sourceLinks: FlowLink[] // assigned by d3
    targetLinks: FlowLink[] // ...

    id: string
    constructor(id) { this.id = id }

    abstract get flowid(): string

    get connects() {
        return this.sourceLinks.concat(this.targetLinks).map(l => l.connects)
    }
}

class SourceNode extends FlowNode {
    get flowid() { return "s" + this.id }
}

class TargetNode extends FlowNode {
    get flowid() { return "t" + this.id }
}

class FlowLink {
    source: string
    target: string
    constructor(public _source, public _target, public value) {
        this.source = "s" + this._source
        this.target = "t" + this._target
    }
    get connects() { return this._source + "-" + this._target }
}

export const SankeyForType = ({ c, type }: { c: LinkController, type: LinkType }) => {

    let lg = m.linkgroups[type]

    let flownodes: FlowNode[] = nodetypes.flatMap(t => [new SourceNode(t), new TargetNode(t)])

    let flowlinks: FlowLink[] =

        nodetypes.cross().map(([s, t]) => {
            let c = getlinkgroupkey(s, t)
            let links = lg[c] ?? []
            return new FlowLink(s, t, links.length)
        })

    const width = 500
    const height = 300

    function rund3(e: HTMLElement) {
        {
            const layout = d3s.sankey<FlowNode, any>()
                .nodeId(d => d.flowid)
                .nodeSort(null as any)
                .linkSort((l1, l2) => l1._target.localeCompare(l2._target))
                .nodeWidth(15)
                .nodePadding(5)
                .extent([[0, 0], [width, height]])

            let { nodes, links } = layout({
                nodes: flownodes,
                links: flowlinks
            })

            const svg = d3
                .select(e)
                .append("svg")
                .attr("viewBox", [0, 0, width, height])

            svg.append("g")
                .selectAll("rect")
                .data(nodes)
                .join("rect")
                .attr("x", d => d.x0!)
                .attr("y", d => d.y0!)
                .attr("height", d => d.y1! - d.y0!)
                .attr("width", d => d.x1! - d.x0!)
                .attr("class", d => cc(d.id, d.flowid))
                .on('click', (_, d) => c.select(...d.connects))
                .append("title")
                .text(d => d.id)

            svg.append("g")
                .selectAll("text")
                .data(nodes)
                .join("text")
                .attr("x", d => d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6)
                .attr("y", d => (d.y1! + d.y0!) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", d => d.x0! < width / 2 ? "start" : "end")
                .text(d => d.id)
                .attr("class", d => "sankey-label")

            const link = svg.append("g")
                .attr("fill", "none")
                .attr("stroke-opacity", 0.5)
                .selectAll("g")
                .data(links)
                .join("g")
                .style("mix-blend-mode", "multiply")

            link.append("path")
                .attr("d", d3s.sankeyLinkHorizontal())
                .attr("fill", "none")
                // .attr("class", l => "sankey-path")
                .attr("stroke-width", d => Math.max(1, d.width))
                .attr('connects', fl => fl.connects)
                .on('click', (ev, fl) => { c.select(fl.connects) })
            //.on('mouseout', (ev, fl) => { c.deselect() })

            link.append("title")
                .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`)
        }
    }

    function onmount(e: HTMLElement) {

        function select(connects: string[], force: boolean) {
            // console.log("select sankey!", connects)
            for (let c of connects) {
                let path = e.querySelector(`[connects=${c}]`)
                path?.classList?.toggle("sel", force)

                let [s, t] = splitconnects(c)
                e.querySelector(`.s${s}`)?.classList?.toggle("sel", force)
                e.querySelector(`.t${t}`)?.classList?.toggle("sel", force)
            }
        }

        c.register(e, select)
    }

    return <div class="sankey" patch={rund3} mounted={onmount} />
}