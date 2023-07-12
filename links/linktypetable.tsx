import * as d3 from "d3"
import { FishLink } from "../elements/fishlink"
import { LinkController } from "./linkcontroller"
import { m } from "../app/model"
import { mount } from "../utils/common"
import { jsx } from "../jmx-lib/core"

export type Matrix<T> = {
    [columns: string]: {
        [rows: string]: T
    }
}

export const LinkStatsForType = ({ links, c, type }: { links: FishLink[], c: LinkController, type }) => {

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

        // let o = {}
        // o[`matrix${type}`] = matrix
        // mount(o)

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
            .data(st => alltypes.map(tt => Object.assign(matrix[st][tt] ?? [], { st, tt, connects: st + "-" + tt })))
            .join('td')
            .attr('connects', ({ connects }) => connects)
            //.on('mouseenter', (_, d) => c.select(d.connects))
            //.on('mouseout', (_, d) => c.deselect())
            .style("background", d => `rgba(170, 204, 187, ${opacityScaler(d.length)})`)
            .text(d => d?.length)
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