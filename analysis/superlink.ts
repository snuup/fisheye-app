import { FishLink } from "./fishlink"


// refcount = number of links in this SuperLink

export class SuperLink {

    links = new Set<FishLink>()

    constructor() { }

    add(l:FishLink) { this.links.add(l) }
    del(l:FishLink) { this.links.delete(l) }
}