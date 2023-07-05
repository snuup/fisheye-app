import { FishLink } from "./fishlink"
import { FishNode } from "./fishnode"

// refcount = number of links in this SuperLink

export class SuperLink implements ILink {

    source: string
    target: string
    type: string
    weight: number

    constructor(public links: FishLink[]) {
        let [source, target] = links.first.unodeids
        this.source = source
        this.target = target
    }
}
