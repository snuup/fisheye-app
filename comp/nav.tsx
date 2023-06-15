import { m } from "../app/model"
import { jsx } from "../jmx-lib/core"
import { NodeView } from "./node-view"

export const Navigation = () => {
    return (
        <nav>
            { m.investigatees.map(n => <NodeView n={n} />) }
        </nav>
    )
}