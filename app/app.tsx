import { patch, jsx, When, updateview } from "../jmx-lib/core"
import { mc1 } from '../data/data'
import '../utils/common'
import { NodeStats } from '../nodestats/nodestats'
import { m } from './model'
import { Link } from './routes'
import { cc, mount } from '../utils/common'
import { NetworkView } from "../networkview/networkview"
import { LinkStats } from "../linkstats/linkstats"
import { GraphStats } from "../graphstats/graphstats"

//let App = () => <body><NodeIdBarChart /></body>

mount({ mc1 })

let App = () => {
    return (
        <body class={cc(m.url)}>
            <header>
                <h2>FishEye MC1</h2>
                <Link url={['nodestats']} />
                <Link url={['linkstats']} />
                <Link url={['graphstats']} />
                <Link url={['network']} />
                {/* <input type="checkbox" onchange={() => document.body.classList.toggle("showpathmatrix")} /> */}
            </header>

            <article id='main' class={m.url[0]}>
                <When cond={m.url[0] == 'nodestats' || m.url[0] as unknown == ''}>
                    <NodeStats />
                </When>
                <When cond={m.url[0] == 'linkstats'}>
                    <LinkStats links={m.graph.links} />
                </When>
                <When cond={m.url[0] == 'graphstats'}>
                    <GraphStats links={m.graph.links} />
                </When>
                <When cond={m.url[0] == 'network'}>
                    <NetworkView />
                </When>
            </article>

            {/* <footer>footer</footer> */}

        </body>
    )
}

patch(document.body, <App />)

mount({ m, mc1, updateview })
