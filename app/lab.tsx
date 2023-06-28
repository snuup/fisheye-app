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

let alltypes = sourcetypes.concat(targettypes).distinctBy().sort()

const linktypetext = d => (d?.toString() ?? "undefined").slice(0, 5)

let table = d3.select(document.body).append('table')
let thead = table.append("thead")
let tbody = table.append("tbody")

// header row
thead
    .append('tr')
    .selectAll('th')
    .data([".", ...alltypes])
    .join('th')
    .text(linktypetext)

let rows =
    tbody
        .selectAll('tr')
        .data(alltypes)
        .join('tr')

rows
    .append('th')
    .text(linktypetext)

let out =
    d3
        .select(document.body)
        .append('div.output')

let setout = (links: any[]) => {
    console.log(links)

    out.selectAll('div')
        .data(links)
        .join('div')
        .text(l => l.sid + " -> " + l.tid)
}

rows
    .selectAll('td')
    .data(st => targettypes.map(tt => [st, tt]))
    .join('td')
    .text(([st, tt]) => matrix[st][tt]?.length)
    .on('click', (_, [st, tt]) => setout(matrix[st][tt]))
//.on('click', (_, [st, tt]) => console.log(matrix[st][tt]))

mount({ matrix, sourcetypes, targettypes })
