import { jsx, jsxf } from "../jmx-lib/core"
import * as d3 from "d3"
import { FishLink } from "../elements/fishlink"
import { SankeyForType } from "./sankey"
import { mount, nicelinktypename } from "../utils/common"
import { LinkHistogram } from "./linkweighthisto"
import { m } from "../app/model"
import { ObjectAsTable } from "./nodestats"

export type Matrix<T> = {
    [columns: string]: {
        [rows: string]: T
    }
}

const LinkStatsForType = ({ links }: { links: FishLink[] }) => {

    function rund3(tableDom: HTMLTableElement) {

        let g = m.graph
        let sourcetypes = links.map(l => g.getnode(l.source).type).distinct()
        let targettypes = links.map(l => g.getnode(l.target).type).distinct()
        let alltypes = sourcetypes.concat(targettypes).distinct().sort() as string[]

        let linksbysource = links.groupBy(l => g.getnode(l.source).type)
        let matrix: Matrix<any> = linksbysource.mapValues(links => links.groupBy(l => g.getnode(l.target).type))

        const linktypetext = d => (d?.toString() ?? "undefined")
        const linktypetextcut = d => linktypetext(d).slice(0, 10)

        mount({ matrix })

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

        rows
            .append('th')
            .text(linktypetextcut)
            .attr("class", linktypetext)

        // let out = d3.select(tableout).on('click', () => setout([]))

        let setout = (links: any[]) => {

            console.log("clücks", links)
            tableout.replaceChildren()

            let rows =
                d3.select(tableout)
                    .on('click', () => setout([]))
                    .selectAll('tr')
                    .data(links.sortBy(l => -l.weight))
                    .join('tr')

            rows.append('td').attr("class", d => linktypetext(d.source.type)).text(d => d.source)
            rows.append('td').attr("class", d => linktypetext(d.target.type)).text(d => d.target)
            rows.append('td').text(d => d.weight.toFixed(4))
        }

        rows
            .selectAll('td')
            .data(st => alltypes.map(tt => [st, tt]))
            .join('td')
            .text(([st, tt]) => matrix[st][tt]?.length)
            .on('click', (_, [st, tt]) => setout(matrix[st][tt]))
    }

    let tableout

    return (
        <div>
            <table class="link-stats-table" patch={rund3} />
            <table class="out" mounted={e => tableout = e} />
        </div>)
}

export const LinkStats = ({ links }: { links: FishLink[] }) => {
    console.log("linkstats", links)
    return (
        <>
            <h2>link stats</h2>
            <div class="stats-top">

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
                links.groupBy(l => l.type).entries.map(([type, links]) => (
                    <div >
                        <h3 class={type}>{type}</h3>
                        <div class="flexy">
                            <LinkStatsForType links={links} />
                            <SankeyForType links={links} />
                        </div>
                    </div>
                ))
            }
        </>)
}