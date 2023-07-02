import { mount } from '../utils/common'
import { Controller } from './controller'
import { m } from './model'
import { jsx, patch } from '../jmx-lib/core'
import { SankeyForType } from '../comp/sankey'
import { mc1 } from '../data/data'

// let c = new Controller()

// let links = m.graph.links // .filter(l => l.sid == m.investigatees[0] || l.tid == m.investigatees[0])
// let linksbytype = links.groupBy(l => l.type)
// let linkso = linksbytype["ownership"]

// const App = (
//     <body>
//         <SankeyForType links={linkso} />
//     </body>
// )

// patch(document.body, App)

// mount({ linkso })

let fm = new Map(mc1.nodes.map(n => [n.id, n.fixed_id]))
let newlinks = mc1.links.map(l => ({ ...l, source: fm.get(l.source), target: fm.get(l.target) }))

mount({ fm, newlinks })