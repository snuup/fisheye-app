import { c } from "../app/controller"
import { m } from "../app/model"
import { jsx, jsxf } from "../jmx-lib/core"
import { Network } from "./network"

export const NetworkView = () => {
    return (
        <>
            <Network />
            <Scores />
        </>
    )
}

const Scores = () => {
    return (
        <div id="scores">
            <table>
                {m.rankedscores.map(s => (
                    <tr onclick={(ev) => c.togglenetnode(ev, s.node)}>
                        <td class="distances">{s.distances.join("-")}</td>
                        <td class="type">{s.node.type}</td>
                        <td class="id">{s.id}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}