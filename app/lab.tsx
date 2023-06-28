import * as d3 from 'd3'
import { mount } from '../utils/common'
import { Controller } from './controller'
import { m } from './model'
import { jsx, patch } from '../jmx-lib/core'
import { FishLink } from '../analysis/fishlink'
import { LinkStats } from './linkstats'

let c = new Controller()

let linksbytype = m.graph.links.groupBy(l => l.type)

const App = (<body>
    {linksbytype.entries.map(([type, links]) => {
        return <div class="linkstats">
            <b>{type}</b>
            <LinkStats links={links} />
        </div>
    })}
</body>)

patch(document.body, App)