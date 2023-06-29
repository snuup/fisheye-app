import * as d3 from 'd3'
import { mount } from '../utils/common'
import { Controller } from './controller'
import { m } from './model'
import { jsx, patch } from '../jmx-lib/core'
import { FishLink } from '../analysis/fishlink'
import { LinkStats } from '../comp/linkstats'
import { ChordForType } from '../comp/chord'

let c = new Controller()

let links = m.graph.links // .filter(l => l.sid == m.investigatees[0] || l.tid == m.investigatees[0])
let linksbytype = links.groupBy(l => l.type)
let linkso = linksbytype["ownership"]

const App = (
    <body>
        <ChordForType links={linkso} />
    </body>
)

patch(document.body, App)

mount({ linkso })