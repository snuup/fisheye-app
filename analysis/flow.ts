
class SourceNode implements FlowNode {
    id: string
    constructor(id) { this.id = id }
    get flowid() { return "s" + this.id }
}

class TargetNode implements FlowNode {
    id: string
    constructor(id) { this.id = id }
    get flowid() { return "t" + this.id }
}

interface FlowNode {
    get id(): string
    get flowid(): string
}

class FlowLink {
    source: string
    target: string
    constructor(public _source, public _target, public value) {
        this.source = "s" + this._source
        this.target = "t" + this._target
    }
    get connects() { return this._source + "-" + this._target }
    //get sourcesort() {  }
}