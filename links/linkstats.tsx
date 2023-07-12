import { jsx } from "../jmx-lib/core"
import { FishLink } from "../elements/fishlink"
import { SankeyForType } from "./linktypesankey"
import { nicelinktypename } from "../utils/common"
import { LinkHistogram } from "../comp/linkweighthisto"
import { m } from "../app/model"
import { ObjectAsTable } from "../comp/namevalue"
import { mc1 } from "../data/data"
import { LinkController } from "./linkcontroller"
import { LinkStatsForType } from "./linktypetable"

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
