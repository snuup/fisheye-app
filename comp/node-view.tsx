import { FishNode } from '../analysis/fishnode'
import { c } from '../app/controller'
import { jsx } from '../jmx-lib/core'
import { NameValue } from './namevalue'
import { NodeDonut } from './node-donut'

export const NodeView = ({ n }: { n: FishNode }) => {
    return (
        <div class='nodeview' onclick={() => c.togglenetnode(n)}>
            <NodeDonut n={n} />
            <h3>{n.id}</h3>
            <div class='gridtable'>
                <NameValue
                    name='degree'
                    value={`${n.outdegree} / ${n.indegree} = ${n.degree}`}
                />
                <NameValue name='type' value={n.type} />
                <NameValue name='country' value={n.country} />
            </div>
        </div>
    )
}
