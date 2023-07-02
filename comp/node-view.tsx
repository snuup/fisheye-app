import { FishNode } from '../analysis/fishnode'
import { c } from '../app/controller'
import { jsx } from '../jmx-lib/core'
import { cc } from '../utils/common'
import { NameValue } from './namevalue'
import { NodeDonut } from './node-donut'

export const NodeView = ({ n }: { n: FishNode }) => {
    return (
        <div class={cc('nodeview', { selected: n.selected })} onclick={(ev) => c.togglenetnode(ev, n)}>
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
