import { jsx, jsxf } from "../jmx-lib/core"
import * as d3 from "d3"
import { FishLink } from "../elements/fishlink"
import { SankeyForType } from "./sankey"
import { mount, nicelinktypename } from "../utils/common"
import { LinkHistogram } from "./linkweighthisto"
import { m } from "../app/model"
import { ObjectAsTable } from "./namevalue"
import { mc1 } from "../data/data"
import { LinkController } from "./linkcontroller"

export type Matrix<T> = {
    [columns: string]: {
        [rows: string]: T
    }
}

const LinkStatsForType = ({ links, c, type }: { links: FishLink[], c: LinkController, type }) => {

    function rund3(tableDom: HTMLTableElement) {

        console.log("path link-stats-table!")

        let g = m.graph
        let sourcetypes = links.map(l => g.getnode(l.source).type).distinct()
        let targettypes = links.map(l => g.getnode(l.target).type).distinct()
        let alltypes = sourcetypes.concat(targettypes).distinct().sort() as string[]

        let linksbysource = links.groupBy(l => g.getnode(l.source).type)
        let matrix: Matrix<any> = linksbysource.mapValues(links => links.groupBy(l => g.getnode(l.target).type))

        const linktypetext = d => (d?.toString() ?? "undefined")
        const linktypetextcut = d => linktypetext(d).slice(0, 10)

        let o = {}
        o[`matrix${type}`] = matrix
        mount(o)

        let max = Math.max(...matrix.values.flatMap(a => a.values).map(c => c.length))
        let opacityScaler = d3.scaleLinear([0, max], [0, 1])

        let table = d3.select(tableDom)
        let thead = table.append("thead")
        let tbody = table.append("tbody")

        // header row
        thead
            .append('tr')
            .selectAll('th')
            .data([".", ...alltypes])
            .join('th')
            .text(linktypetextcut)
            .attr("class", linktypetext)

        let rows =
            tbody
                .selectAll('tr')
                .data(alltypes)
                .join('tr')
                .attr('linktype', d => d)

        rows
            .append('th')
            .text(linktypetextcut)
            .attr("class", linktypetext)

        // let out = d3.select(tableout).on('click', () => setout([]))

        let setout = (links: any[]) => {

            //console.log("clücks", links)
            tableout.replaceChildren()

            let rows =
                d3.select(tableout)
                    .on('click', () => setout([]))
                    .selectAll('tr')
                    .data(links.sortBy(l => -l.weight))
                    .join('tr')

            rows.append('td').attr("class", d => linktypetext(m.graph.getnode(d.source).type)).text(d => d.source)
            rows.append('td').attr("class", d => linktypetext(m.graph.getnode(d.target).type)).text(d => d.target)
            rows.append('td').text(d => d.weight.toFixed(4))
        }

        rows
            .selectAll('td')
            .data(st => alltypes.map(tt => {
                let cell = matrix[st][tt] ?? []
                if (cell) {
                    cell.st = st
                    cell.tt = tt
                }
                return cell
            }))
            .join('td')
            .attr('connects', d => d.st + "-" + d.tt)
            .on('click', (_, d) => c.select(d.st + "-" + d.tt))
            .style("background", d => `rgba(170, 204, 187, ${opacityScaler(d.length)})`)
            .text(d => d?.length)
        //.on('click', (_, d) => setout(d))
    }

    let tableout

    function onmount(e: HTMLElement) {

        function select(connects: string, force: boolean) {
            //console.log("select linkstat!")
            let td = e.querySelector(`[connects=${connects}]`)
            td?.classList.toggle("sel", force)
            // td.style.backgroundImage = `linear-gradient(to bottom left, ${targetcolor} 50%, ${sourcecolor} 50%)`
        }

        c.register(e, select)
    }

    return (
        <div mounted={onmount}>
            <table class="link-stats-table" patch={rund3} />
            <table class="out" mounted={e => tableout = e} />
        </div>)
}

export const LinkStats = ({ links }: { links: FishLink[] }) => {
    //console.log("linkstats", links)
    return (
        <div class="stats">
            <h2>link statistics</h2>
            <div class="stats-top">

                <div>
                    <h3>counts</h3>
                    {<ObjectAsTable o={{
                        nodes: mc1.nodes.length,
                        links: mc1.links.length
                    }} />}
                </div>

                <div>
                    <h3>link types</h3>
                    {<ObjectAsTable o={m.graph.linkcountsByType.mapKeys(nicelinktypename)} />}
                </div>

                <div>
                    <h3>link weights</h3>
                    <LinkHistogram links={links} />
                </div>
            </div>

            {
                links.groupBy(l => l.type).entries.slice(0, 10).map(([type, links]) => {
                    let lc = new LinkController()
                    return (
                        <div>
                            <h3 class={type}>{type}</h3>
                            <div class="flexy link-type">
                                <LinkStatsForType links={links} c={lc} type={type} />
                                <SankeyForType links={links} c={lc} />
                            </div>
                        </div>
                    )
                })
            }
        </div>)
}
