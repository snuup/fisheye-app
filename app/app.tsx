import { patch, jsx, When, updateview } from "../jmx-lib/core"
import { mc1 } from '../data/data'
import '../utils/common'
import { GraphStats } from '../comp/stats'
import { m } from './model'
import { Controller } from './controller'
import { Link } from './routes'
import { mount } from '../utils/common'
import { GraphView } from "../comp/graphview"
import { Navigation } from "../comp/nav"

let c = new Controller()

let App = () => (
    <body>
        <header id='toolbar'>
            <h2>Mini Challenge 1</h2>
            <Link url={['stats']} />
            <Link url={['graph']} />
        </header>

        <Navigation />

        <article id='main'>
            <When cond={m.url[0] == 'stats'}>
                <GraphStats />
            </When>
            <When cond={m.url[0] == 'graph'}>
                <GraphView />
            </When>
        </article>

        <footer>footer</footer>
    </body>
)

patch(document.body, <App />)

mount({ m, c, mc1, updateview })
