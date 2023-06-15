import { FishNode } from "../analysis/fishnode"
import { jsx } from "../jmx-lib/core"
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

function NameValue({ name, value }: { name: string, value?: number | string }, { children }) {
    console.log("nv", children, children())
    let cn = children()
    if(!cn.length && value === undefined) return null
    return (
        <div class="namevalue">
            <label>{name}</label>
            {cn.length ? cn : <span class="value">{ value?.toString() ?? "-"}</span>}
        </div>)
}