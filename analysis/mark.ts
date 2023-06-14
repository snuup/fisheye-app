import { FishLink } from "./fishlink"

export class DirectedLink {

    link: FishLink
    rev: boolean

    constructor(link: FishLink, rev: boolean) {
        this.link = link
        this.rev = rev
    }

    get key() { return this.link.key + "|" + this.rev.toString() }
    get original() { return this.link.original }
    get nodes() { return this.link.nodes }

    get sid() { return this.rev ? this.link.tid : this.link.sid }
    get tid() { return this.rev ? this.link.sid : this.link.tid }
}

export class Mark {

    chain: DirectedLink[]

    constructor(chain: DirectedLink[]) {
        this.chain = chain
    }

    get key() {
        return this.chain.map(fl => fl.key).join("|")
    }

    get length() {
        return this.chain.length
    }

    get properties() {
        return {
            "prop-header": "mark",
            //origin: this.origin.id,
            //distance: this.distance,
            //link: this.link?.type,
            //chain: `${this.chain.length}:\n` + this.chain.map(l => `${l.original.source} - ${l.original.type} - ${l.original.target}`).join("\n\n")
            chain: `${this.chain.length}:\n` + this.chain.map(l => `${l.original.type}`).join("\n")
        }
    }
}
