import * as d3 from "d3"
import * as d3s from 'd3-sankey'
import { FishLink } from "../elements/fishlink"
import { jsx } from "../jmx-lib/core"
import { mount } from "../utils/common"
import { m } from "../app/model"

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
    get connects() { return this._source + "-" + this._target }
}

export const SankeyForType = ({ links }: { links: FishLink[] }) => {

    let gn = m.graph.getnode
    let sourcetypes = links.map(l => gn(l.source).type).distinct()
    let targettypes = links.map(l => gn(l.target).type).distinct()
    let alltypes = sourcetypes.concat(targettypes).distinct().sort().map(s => s ?? "undefined") as string[]
    let linksbysource = links.groupBy(l => gn(l.source).type)
    let flownodes: FlowNode[] = alltypes.flatMap(t => [new SourceNode(t), new TargetNode(t)])
    let flowlinks: FlowLink[] = []
    for (let source in linksbysource) {
        let linksbytarget = linksbysource[source].groupBy(l => gn(l.target).type)
        for (let target in linksbytarget) {
            flowlinks.push(new FlowLink(source, target, linksbytarget[target]?.length ?? 0))
        }
    }

    const width = 500
    const height = 300
    let td = null as null | HTMLTableCellElement

    function rund3(e: HTMLElement) {
        {
            const layout = d3s.sankey<FlowNode, any>()
                .nodeId(d => d.flowid)
                .nodeSort(null as any)
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
                .attr("fill", "none")
                .attr("class", l => l.source.id + " sankey-path")
                .attr("stroke-width", d => Math.max(1, d.width))
                .on('mouseenter', (ev, fl) => {
                    td = ev.target.closest('.link-type').querySelector('td[connects=' + fl.connects + ']')
                    if(!td) return

                    let thsource = td.closest('tr')!.querySelector('th')
                    let thtarget = td.closest("table")!.querySelectorAll("thead th")[td.cellIndex]
                    if(!thsource) return
                    if(!thtarget) return

                    let sourcecolor = window.getComputedStyle(thsource).backgroundColor
                    let targetcolor = window.getComputedStyle(thtarget).backgroundColor

                    td.style.backgroundImage = `linear-gradient(to bottom left, ${targetcolor} 50%, ${sourcecolor} 50%)`

                    console.log("enter", fl, td, thsource, thtarget)
                })
                .on('mouseout', (ev, fl) => {
                    //console.log("out", fl)
                    if(!td) return
                    td.style.background = ""  //classList.remove("sel")
                    td = null
                })

            link.append("title")
                .text(d => `${d.source.name} → ${d.target.name}\n${d.value}`)

            svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .selectAll("text")
                .data(nodes)
                .join("text")
                .attr("x", d => d.x0! < width / 2 ? d.x1! + 6 : d.x0! - 6)
                .attr("y", d => (d.y1! + d.y0!) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", d => d.x0! < width / 2 ? "start" : "end")
                .text(d => d.id)
                .attr("class", d => d.id + " sankey-label")
        }
    }

    return <div class="sankey" patch={rund3} />
}