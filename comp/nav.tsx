import { issuspicious } from "../analysis/common"
import { m } from "../app/model"
import { jsx } from "../jmx-lib/core"
import { NodeView } from "./node-view"

export const Navigation = () => {

    let invs = m.investigatees.map(m.graph.getnode)
    let susps = m.graph.nodes.filter(n => issuspicious(n.id) )
    let all = invs.concat(susps)

    return (
        <nav>
            { all.map(n => <NodeView n={n} />) }
        </nav>
    )
}