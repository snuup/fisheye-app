import { jsx } from "../jmx-lib/core"
import { FishLink } from "../elements/fishlink"
import { SankeyForType } from "./linktypesankey"
import { LinkHistogram } from "./linkweighthisto"
import { m } from "../app/model"
import { ObjectAsTable } from "../comp/namevalue"
import { mc1 } from "../data/data"
import { LinkController } from "./linkcontroller"
import { LinkStatsForType } from "./linktypetable"
import { linktypes, nicelinktype as nicelinktype } from "../analysis/common"

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
                    {<ObjectAsTable o={m.graph.linkcountsByType.mapKeys(nicelinktype)} />}
                </div>

                <div>
                    <h3>link weights</h3>
                    <LinkHistogram links={links} />
                </div>
            </div>

            {
                linktypes.map(type => {
                    let lc = new LinkController()
                    return (
                        <div>
                            <h3 class={type}>{nicelinktype(type)}</h3>
                            <div class="flexy link-type">
                                <LinkStatsForType c={lc} type={type} />
                                <SankeyForType c={lc} type={type} />
                            </div>
                        </div>
                    )
                })
            }
        </div>)
}
