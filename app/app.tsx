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
import { NodeDonut } from "../comp/node-donut"
import { MatrixView } from "../comp/matrixview"
import { HierarchyView } from "../comp/hierarchyview"
import { SeaView } from "../comp/seaview"
import { LinkStats } from "../comp/linkstats"

let c = new Controller()

let App = () => (
    <body>
        <header>
            <h2>Mini Challenge 1</h2>
            <Link url={['stats']} />
            <Link url={['matrix']} />
            <Link url={['graph']} />
            <Link url={['tree']} />
        </header>

        <Navigation />

        <article id='main'>
            <When cond={m.url[0] == 'stats'}>
                <GraphStats />
            </When>
            <When cond={m.url[0] == 'matrix'}>
                <MatrixView />
            </When>
            <When cond={m.url[0] == 'graph'}>
                <SeaView />
            </When>
            <When cond={m.url[0] == 'tree'}>
                <HierarchyView />
            </When>
            <When cond={m.url[0] == 'links'}>
                <LinkStats links={m.graph.links} />
            </When>
        </article>

        <footer>footer</footer>

        {/* <NodeDonut n={m.graph.getnode("SeaSpray Wave SRL Solutions")} /> */}

    </body>
)

patch(document.body, <App />)

mount({ m, c, mc1, updateview })
