import { NodeDonut } from "../comp/node-donut"
import { jsx, patch, updateview } from "../jmx-lib/core"
import { mount } from "../utils/common"
import { Controller } from "./controller"
import { m } from "./model"

//let c = new Controller()
//let n = m.investigatees[1]

let n = [
    {type: "partner", outs: 5, ins: 5, total: 10 },
    {type: "family", outs: 10, ins: 20, total: 30 }
]

let App = () =>
    <body>
        <NodeDonut n={n} />
    </body>

patch(document.body, <App />)

mount({ updateview })
