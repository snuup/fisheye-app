import { patch, jsx, When, updateview } from "../jmx-lib/core"
import { mc1 } from '../data/data'
import '../utils/common'
import { NodeStats } from '../comp/nodestats'
import { m } from './model'
import { Link } from './routes'
import { mount } from '../utils/common'
import { Navigation } from "../comp/nav"
import { MatrixView } from "../comp/matrixview"
import { HierarchyView } from "../comp/hierarchyview"
import { SeaView } from "../comp/seaview"
import { LinkStats } from "../comp/linkstats"
import { NetworkView } from "../comp/networkview"

let App = () => {
    return (
        <body>
            <header>
                <h2>Mini Challenge 1</h2>
                <Link url={['nodestats']} />
                <Link url={['linkstats']} />
                <Link url={['matrix']} />
                <Link url={['network']} />
                <Link url={['tree']} />
            </header>

            <Navigation />

            <article id='main' class={m.url[0]}>
                <When cond={m.url[0] == 'nodestats'}>
                    <NodeStats />
                </When>
                <When cond={m.url[0] == 'linkstats'}>
                    <LinkStats links={m.graph.links} />
                </When>
                <When cond={m.url[0] == 'matrix'}>
                    <MatrixView />
                </When>
                <When cond={m.url[0] == 'network'}>
                    {/* <SeaView /> */}
                    <NetworkView />
                </When>
                <When cond={m.url[0] == 'tree'}>
                    <HierarchyView />
                </When>
            </article>

            <footer>footer</footer>

            {/* <NodeDonut n={m.graph.getnode("SeaSpray Wave SRL Solutions")} /> */}

        </body>
    )
}

patch(document.body, <App />)

mount({ m, mc1, updateview })
