import { patch, jsx, updateview } from 'jmx/core'
import { initrouter } from 'jmx/router'
import { mount, rebind } from 'jmx/util/common'
import { mc1 } from '../data/data'
import "../utils/common"

// let z: Hase = 'hui'

let m = {
    counter1: 2,
    counter2: 3,
    get sum() {
        return m.counter1 + m.counter2
    },
}

class Controller {
    constructor() {
        rebind(this)
        initrouter(this.setroute)
    }

    setroute() {
        //m.url = document.location.pathname.split('/').slice(1) as Url
        updateview('#main')
    }

    inc1(ev: PointerEvent) {
        m.counter1++
        updateview(ev.target as Node)
        updateview('#sum')
    }

    inc2(ev: PointerEvent) {
        m.counter2++
        updateview(ev.target as Node)
        updateview('#sum')
    }
}

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
        <h1>here counts:</h1>
        <div>{mc1.nodes.length} nodes</div>
        <div>{mc1.links.length} links</div>
        <div>
            <Counter value={m.counter1} inc={c.inc1} />
            <Counter value={m.counter2} inc={c.inc2} />
        </div>
        <div id='sum'>{m.sum}</div>
    </body>
)

patch(document.body, <App />)

mount({ m, c, mc1 })
