import { m } from '../app/model'
import { ArrayAsTable, ObjectAsTable } from '../comp/namevalue'
import { NodeDonut } from '../comp/node-donut'
import { mc1 } from '../data/data'
import { FishNode } from '../elements/fishnode'
import { jsx } from '../jmx-lib/core'
import { cc, mount } from '../utils/common'

export const GraphStats = () => {
    let components = [
        [3151, 1],
        [36, 1],
        [15, 1],
        [5, 5],
        [4, 9],
        [3, 33],
        [2, 31],
    ]

    //let multilinksdirected = m.graph.links.countBy(l => l.key).entries.filter(([_, count]) => count > 1)
    let multilinksdirected = m.graph.links.groupBy(l => l.key).entries.filter(([_, ls]) => ls.length > 1).sortBy(([_, ls]) => -ls.length)
    //let multilinks = multilinksdirected.flatMap(([_, ls]) => ls)

    let multilinksundirected = m.graph.links.groupBy(l => l.ukey).entries.filter(([_, ls]) => ls.length > 1).sortBy(([_, ls]) => -ls.length)

    mount({ multilinksdirected, multilinksundirected })

    return (
        <div class='stats'>
            <h2>graph statistics</h2>
            <div class='stats-top'>
                <div>
                    <h3>counts</h3>
                    {
                        <ObjectAsTable
                            o={{
                                nodes: mc1.nodes.length,
                                links: mc1.links.length,
                            }}
                        />
                    }
                </div>

                <div>
                    <h3>connectedness</h3>
                    {<ArrayAsTable array={components} />}
                </div>

                <div class="multilinks">
                    <h3>multiple links (directed)</h3>
                    <div class="small-grid">
                        <ObjectAsTable o={{ groups: multilinksdirected.length }} />
                    </div>
                    <div class="occuriences">
                        <h3>group size - occurencies (directed)</h3>
                        {<ArrayAsTable array={multilinksdirected.map(([, b]) => b.length).countBy().entries.sortBy(([length, counts]) => -length)} />}
                    </div>
                    <table class="data-list">
                        {multilinksdirected.flatMap(([_, ls]) => ls).slice(0, 30).map(l => (
                            <tr>
                                <td>{l.source}</td>
                                <td>{l.target}</td>
                                <td class={l.type}>{l.type}</td>
                            </tr>
                        ))}
                    </table>
                </div>

                <div class="multilinks">
                    <h3>multiple links (undirected)</h3>
                    <div class="small-grid">
                        <ObjectAsTable o={{ groups: multilinksundirected.length }} />
                    </div>
                    <div class="occuriences">
                        <h3>group size - occurencies (undirected)</h3>
                        {<ArrayAsTable array={multilinksundirected.map(([, b]) => b.length).countBy().entries.sortBy(([length, counts]) => -length)} />}
                    </div>
                    <table class="data-list">
                        {multilinksundirected.flatMap(([_, ls]) => ls).slice(0, 30).map(l => (
                            <tr>
                                <td>{l.source}</td>
                                <td>{l.target}</td>
                                <td class={l.type}>{l.type}</td>
                            </tr>
                        ))}
                    </table>
                </div>

            </div>

            <div class="supergraph">
                <h3>supergraph</h3>
                <ObjectAsTable o={{ nodes: m.supergraph.nodes.length, links: m.supergraph.links.length }} />
            </div>

            <div class="topdegrees">
                <h3>top 25 nodes with heighest degrees</h3>
                <div class='degreecontainer'>
                    {m.supergraph.gettopdegrees().map(n => DegreeView(n))}
                </div>
            </div>

        </div>
    )
}

const NodeName = ({ nid }: { nid: string }) => {
    let red = m.investigatees.find(n => n === nid)
    return <span class={cc('nodename', { red })}>{nid}</span>
}

const DegreeView = (n: FishNode) => {
    return (
        <div class='degree'>
            <NodeDonut n={n} />
            <NodeName nid={n.id} />
            <span>{n?.type}</span>
            <span>{n.country}</span>
        </div>
    )
}