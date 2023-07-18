import * as d3 from "d3"
import { LinkController } from "./linkcontroller"
import { m } from "../app/model"
import { jsx } from "../jmx-lib/core"
import { getconnects, getlinkgroupkey, nicenodetype, nodetypes } from "../analysis/common"
import { identity, mount } from "../utils/common"

export const LinkStatsForType = ({ c, type }: { c: LinkController, type: LinkType }) => {

    function rund3(tableDom: HTMLTableElement) {

        console.log("path link-stats-table!")

        let lg = m.linkgroups[type]
        let max = lg.values().map(ls => ls.length).max()
        let opacityScaler = d3.scaleSqrt([0, max], [0, 1])
        let bgcolor = d3.interpolateRgb("white", d3.rgb(170, 204, 187))
        mount({ bgcolor })

        let table = d3.select(tableDom)
        let thead = table.append("thead")
        let tbody = table.append("tbody")

        let headrow =
            thead
                .append('tr')

        headrow
            .append('th')
            .text(".")
            .attr("class", "all")
            .on("mouseenter", (_, d) => {
                tableDom.classList.add("multiselect")
                c.select(nodetypes.cross().map(([st, tt]) => getlinkgroupkey(st, tt)))
            })
            .on("mouseout", () => {
                tableDom.classList.remove("multiselect")
                c.deselect()
            })

        headrow
            .selectAll('th.x')
            .data(nodetypes)
            .join('th')
            .text(nicenodetype)
            .attr("class", d => d + " x")
            .on("mouseenter", (_, d) => c.select(nodetypes.map(st => getlinkgroupkey(st, d))))
            .on("mouseout", () => c.deselect())

        let rows =
            tbody
                .selectAll('tr')
                .data(nodetypes)
                .join('tr')
                .attr('linktype', d => d)

        rows
            .append('th')
            .text(nicenodetype)
            .attr("class", d => d)
            .on("mouseenter", (_, d) => c.select(nodetypes.map(tt => getlinkgroupkey(d, tt))))
            .on("mouseout", () => c.deselect())

        let setout = (links: any[]) => {

            console.log("setout", links)

            tableout.replaceChildren()

            let rows =
                d3.select(tableout)
                    .on('click', () => setout([]))
                    .selectAll('tr')
                    .data(links.sortBy(l => -l.weight))
                    .join('tr')

            rows.append('td').attr("class", d => nicenodetype(m.graph.getnode(d.source).type)).text(d => d.source)
            rows.append('td').attr("class", d => nicenodetype(m.graph.getnode(d.target).type)).text(d => d.target)
            rows.append('td').text(d => d.weight.toFixed(4))
        }

        rows
            .selectAll('td')
            .data(st => nodetypes.map(tt => {
                let links = lg[getlinkgroupkey(st, tt)] ?? []
                return ({ st, tt, links, length: links.length })
            }))
            .join('td')
            .attr('connects', getconnects)
            .on('mouseenter', (_, d) => c.select([getconnects(d)]))
            .on('mouseout', (_, d) => c.deselect())
            .on("click", (_, d) => setout(d.links))
            .style("background", ({ length }) => bgcolor(opacityScaler(length)))
            .text(d => d.length)
    }

    let tableout

    function onmount(e: HTMLElement) {

        function select(connects: string[], force: boolean) {
            //console.log("select linkstat!")
            if (connects.length < 10) {
                for (let c of connects) {
                    let td = e.querySelector(`[connects=${c}]`)
                    td?.classList.toggle("sel", force)
                }
            }
        }

        c.register(e, select)
    }

    return (
        <div mounted={onmount}>
            <table class="link-stats-table" patch={rund3} />
            <table class="out" mounted={e => tableout = e} />
        </div>)
}