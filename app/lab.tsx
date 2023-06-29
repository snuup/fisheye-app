import * as d3 from 'd3'
import { mount } from '../utils/common'
import { Controller } from './controller'
import { m } from './model'
import { jsx, patch } from '../jmx-lib/core'
import { FishLink } from '../analysis/fishlink'
import { LinkStats } from '../comp/linkstats'

let c = new Controller()

let links = m.graph.links // .filter(l => l.sid == m.investigatees[0] || l.tid == m.investigatees[0])

let linksbytype = links.groupBy(l => l.type)

const App = (<body>
    {linksbytype.entries.map(([type, links]) => {
        return <div class="linkstats">
            <b>{type}</b>
            <LinkStats links={links} />
        </div>
    })}
</body>)

patch(document.body, App)