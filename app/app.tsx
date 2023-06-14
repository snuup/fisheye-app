import { patch, jsx, updateview } from 'jmx/core'
import { initrouter } from 'jmx/router'
import { mount, rebind } from 'jmx/util/common'
import { mc1 } from '../data/data'
import "../utils/common"
import { GraphStats } from './stats'
import { m } from './model'
import { Controller } from './controller'
import { run } from '../visuals/node-donut'

// let z: Hase = 'hui'

// run()

let c = new Controller()

let Counter = ({
    value,
    inc,
}: {
    value: number
    inc: ActionT<PointerEvent>
}) => <div onclick={inc}>{value}</div>

let App = () => (
    <body>
        <h1>Mini Challenge 1</h1>
        <GraphStats />
    </body>
)

patch(document.body, <App />)

mount({ m, c, mc1 })
