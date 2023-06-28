// import { FishLink } from '../analysis/fishlink'
// import { FishNode } from '../analysis/fishnode'
// import { getPathsHierarchy } from '../comp/hierarchyview'
// import { mc1 } from '../data/data.min'
import * as d3 from 'd3'
import { mount } from '../utils/common'
import { Controller } from './controller'
import { m } from './model'

let c = new Controller()

let linksbytype = m.graph.links.groupBy(l => l.type)

let olinks = linksbytype["ownership"]
olinks

let sourcetypes = linksbytype["ownership"].map(l => l.target.type).distinctBy()
let targettypes = linksbytype["ownership"].map(l => l.target.type).distinctBy()
let linksbysource = linksbytype["ownership"].groupBy(l => l.source.type)
let matrix = linksbysource.mapValues(links => links.groupBy(l => l.target.type))

mount({ linksbysource, matrix })

//mount({ matrixo, linksbysource })

// let i = 0
// for (let st of sourcetypes) {
//     let j = 0
//     for (let tt of targettypes) {
//         //       console.log(i, j, st, tt, matrix[st][tt]?.length)
//         j++
//     }
//     i++
// }

d3.select(document.body)
    .selectAll('table')
    .data(sourcetypes)
    .join('tr')
    .selectAll('td')
    .data(st => targettypes.map(tt => [st, tt]))
    .join('td')
    .text(([st, tt]) => matrix[st][tt]?.length)
    //.on('click', (...args) => console.log(args))
    .on('click', (_, [st, tt]) => console.log(matrix[st][tt]))
