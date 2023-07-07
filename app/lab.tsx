import * as d3 from 'd3'
import { mount } from '../utils/common'

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

let p = d3.path()
p.moveTo(10, 5)
p.lineTo(20, 255)
p.moveTo(100, 50)
p.lineTo(20, 255)
p.rect(20, 20, 100, 50)

d3
    .select(document.body)
    .append('svg')
    .append('path')
    .attr('d', p.toString())
    .attr('stroke', '#333')