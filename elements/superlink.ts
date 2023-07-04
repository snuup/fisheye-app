import { FishLink } from "./fishlink"
import { FishNode } from "./fishnode"

// refcount = number of links in this SuperLink

export class SuperLink {

    sid: string
    tid: string
    source: FishNode
    target: FishNode

    constructor(public links: FishLink[]) {
        let [sid, tid] = links.first.unodeids
        this.sid = sid
        this.tid = tid
    }
}

// export class SuperLink {

//     links = new Set<FishLink>()

//     constructor() { }

//     add(l:FishLink) { this.links.add(l) }
//     del(l:FishLink) { this.links.delete(l) }
// }