import { FishNode } from "../analysis/fishnode"
import { jsx } from "../jmx-lib/core"
import { NameValue } from "./namevalue"
import { NodeDonut } from "./node-donut"

export const NodeView = ({ n }: { n: FishNode }) => {
    return (
        <div class="nodeview">
            <NodeDonut n={n} />
            <h3>{n.id}</h3>
            <NameValue name="degree">
                <span class="value">{n.degree}</span> <span>({n.outdegree} / {n.indegree})</span>
            </NameValue>
            <NameValue name="type" value={n.type} />
            <NameValue name="country" value={n.country} />
        </div>)
}
