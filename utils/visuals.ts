import { assertPipelinePrimaryTopicReference } from '@babel/types'
import * as d3 from 'd3'


const getcolor = d3.scaleOrdinal(d3.schemeCategory10)

export function nodeColorScale(x) {
    let c = ""

    switch (x) {
        //case "event": return "magenta"
        case undefined:
        case "undefined":
            c = "#aaaaaa"
            break
        default:
            c = getcolor(x)
    }
    //    console.log("nodeColorScale", x, c)
    return c
}

// export function linkColorScale(l) {
//     console.log("linkColorScale", l)
//     switch(l){
//         case "membership: "
//     }
//     //x = String(x) // ensure that undefined and 'undefined' map to same color
//     //let r = getcolor(x)
//     //console.log("nodecolor", x, r)
//     //return r
// }
