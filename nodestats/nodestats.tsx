import { jsx, jsxf } from "../jmx-lib/core"
import * as d3 from 'd3'
import { cc, mount } from '../utils/common'
import { m } from '../app/model'
import { FishNode } from '../elements/fishnode'
import { NodeDonut } from '../comp/node-donut'
import { mc1 } from "../data/data"
import { ObjectAsTable } from "../comp/namevalue"
import { nicenodetype } from "../analysis/common"

export const NodeStats = () => {
    let g = m.graph

    const nodecountsByType = g.nodes.countBy(n => n.type ?? "")

    let o: { country: number, id: number, type: number } = mc1.nodes.flatMap(n => n.keys).countBy()
    delete (o as any).donut
    let propertystats =
    {
        total: mc1.nodes.length as number,
        id: o.id,
        type: o.type,
        country: o.country
    }

    return (
        <div class="stats">
            <h2>node statistics</h2>

            <div class="stats-top">
                <div>
                    <h3>counts</h3>
                    {<ObjectAsTable o={{
                        nodes: g.nodes.length,
                        links: g.links.length
                    }} />}
                </div>

                <div>
                    <h3>node properties</h3>
                    {<ObjectAsTable o={propertystats} showbars={true} />}
                    {/* <NodeIdBarChart /> */}
                </div>

                <div>
                    <h3>node id string lengths</h3>
                    <NodeIdStats />
                </div>

                <div>
                    <h3>node types</h3>
                    {<ObjectAsTable o={nodecountsByType.mapKeys(nicenodetype)} multiplier={1} showbars={true} />}
                </div>

                <div>
                    <h3>country appearances</h3>
                    <NodeCountryStats />
                </div>

            </div>

        </div>
    )
}




const NodeIdStats = () => {
    let o = mc1.nodes.groupBy(n => n.id.length)
    let maxcount = o.values.map(v => v.length).max()
    let scaler = d3.scaleLinear([0, maxcount], [0, 100])
    // rename undefined into numbers
    o.numeric = o.undefined
    delete o.undefined

    return (
        <div class="gridtable gridtable3">
            {
                o.entrieskv.sortBy(({v}) => -v.length).map(({ k, v }) => (
                    <>
                        <label>{k}</label>
                        <div class="value">
                            <span class='bar' style={`width:${scaler(v.length)}%`} > {v.length}</span>
                        </div>
                        <div title={v.map(n => n.id).sortauto().join('\n')}>{v.first?.id + (v.length > 1 ? ", ..." : "")}</div>
                    </>
                ))
            }
        </div >
    )
}

const NodeCountryStats = () => {
    let o = mc1.nodes.groupBy(n => n.country).entrieskv.groupBy(({ v }) => v.length)
    mount({ o })
    let maxcount = o.keys.map(x => +x).max()
    let scaler = d3.scaleLinear([0, maxcount], [0, 100])
    return (
        <div class="gridtable gridtable3">
            {
                o.entrieskv.sortBy(({ k }) => -k).map(({ k, v }) => (
                    <>
                        <label>{v.length}</label>
                        <div class="value">
                            <span class='bar' style={`width:${scaler(k)}%`} > {k}</span>
                        </div>
                        <div title={v.map(n => n.k).sortauto().join('\n')}>{v.first?.k + (v.length > 1 ? ", ..." : "")}</div>
                    </>
                ))
            }
        </div >
    )
}

