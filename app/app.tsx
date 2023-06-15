import { patch, jsx, When } from 'jmx/core'
import { mount } from 'jmx/util/common'
import { mc1 } from '../data/data'
import '../utils/common'
import { GraphStats } from './stats'
import { m } from './model'
import { Controller } from './controller'
import { Link } from './routes'
import { GraphView } from './graphview'

let c = new Controller()

let App = () => (
    <body>

        <h1>Mini Challenge 1</h1>

        <header id='toolbar'>
            <Link url={['stats']} />
            <Link url={['graph']} />
        </header>

        <nav>navi</nav>

        <article id='main'>
            <When cond={m.url[0] == 'stats'}>
                <GraphStats />
            </When>
            <When cond={m.url[0] == 'graph'}>
                <GraphView />
            </When>
        </article>

        <footer>
            footer
        </footer>

    </body>
)

patch(document.body, <App />)

mount({ m, c, mc1 })
