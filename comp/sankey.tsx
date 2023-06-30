import * as d3 from "d3"
import * as d3s from 'd3-sankey'
import { FishLink } from "../analysis/fishlink"
import { jsx } from "../jmx-lib/core"
import { Matrix } from "./linkstats"
import { mount } from "../utils/common"

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

    let flownodes = alltypes.map(t => "s" + t) .concat(alltypes.map(t => "t" + t))

    let flowlinks: any[] = []
    for (let source in linksbysource) // .mapValues(links => links.groupBy(l => l.target.type))
    {
        let linksbytarget = linksbysource[source].groupBy(l => l.target.type)
        for (let target in linksbytarget) {
            flowlinks.push({
                source: "s" + source,
                target: "t" + target,
                value: linksbytarget[target]?.length ?? 0
            })
        }
    }

    //let matrixo: Matrix<any> = linksbysource.mapValues(links => links.groupBy(l => l.target.type))

    //let matrix = alltypes.map(s => alltypes.map(t => matrixo[s]?.[t]?.length ?? 0))

    mount({ sourcetypes, targettypes, linksbysource, alltypes, flowlinks })

    const width = 600
    const height = 300

    function rund3(e: HTMLElement) {
        {
            console.log("sankey")

            const layout = d3s.sankey<any, any>()
                .nodeId(d => d.data)
                .nodeWidth(15)
                .nodePadding(20)
                .extent([[0, 0], [width, height]]);

            let graph = layout({
                nodes: flownodes.map(d => ({ data: d })),
                links: flowlinks
            })

            mount({ layout, graph })

            console.log(graph, layout)
        }
    }

    return (
        <div>
            <div patch={rund3} />
            <b>sankey</b>
        </div>)
}