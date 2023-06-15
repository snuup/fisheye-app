import { NodeDonut } from "../comp/node-donut"
import { jsx, patch, updateview } from "../jmx-lib/core"
import { mount } from "../utils/common"
import { Controller } from "./controller"
import { m } from "./model"

let c = new Controller()
let n = m.investigatees[1]

let App = () =>
    <body>
        <NodeDonut n={window.n} />
    </body>

patch(document.body, <App />)

mount({ updateview })
