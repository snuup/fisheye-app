import * as d3 from "d3"
import { FishLink } from "../analysis/fishlink"
import { jsx } from "../jmx-lib/core"

export type Matrix<T> = {
    [columns: string]: {
        [rows: string]: T
    }
}

export const LinkStats = ({ links }: { links: FishLink[] }) => {

    function rund3(tableDom: HTMLTableElement) {

        let sourcetypes = links.map(l => l.target.type).distinctBy()
        let targettypes = links.map(l => l.target.type).distinctBy()
        let linksbysource = links.groupBy(l => l.source.type)
        let matrix: Matrix<any> = linksbysource.mapValues(links => links.groupBy(l => l.target.type))
        let alltypes = sourcetypes.concat(targettypes).distinctBy().sort()
        const linktypetext = d => (d?.toString() ?? "undefined").slice(0, 5)

        let table = d3.select(tableDom)
        let thead = table.append("thead")
        let tbody = table.append("tbody")

        // header row
        thead
            .append('tr')
            .selectAll('th')
            .data([".", ...alltypes])
            .join('th')
            .text(linktypetext)

        let rows =
            tbody
                .selectAll('tr')
                .data(alltypes)
                .join('tr')

        rows
            .append('th')
            .text(linktypetext)

        let out =
            d3
                .select(document.body)
                .append('table')
                .attr("class", "out")
                .on('click', () => setout([]))


        let setout = (links: any[]) => {
            console.log(links)

            let rows = out.selectAll('tr')
                .data(links)
                .join('tr')

            rows.selectAll('td')
                .data(d => [d.sid, d.tid, linktypetext(d.source.type), linktypetext(d.target.type)])
                .join('td')
                .text(d => d)
        }

        rows
            .selectAll('td')
            .data(st => alltypes.map(tt => [st, tt]))
            .join('td')
            .text(([st, tt]) => matrix[st][tt]?.length)
            .on('click', (_, [st, tt]) => setout(matrix[st][tt]))

    }

    return <table patch={rund3} ><span>hase</span></table>
}