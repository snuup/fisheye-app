type LinkType =
    "partnership" |
    "family_relationship" |
    "membership" |
    "ownership"

type NodeType =
    "company" |
    "organization" |
    undefined |
    "person" |
    "location" |
    "political_organization" |
    "vessel" |
    "movement" |
    "event"

type NodeTypeS =
    "company" |
    "organization" |
    "undefined" |
    "person" |
    "location" |
    "political_organization" |
    "vessel" |
    "movement" |
    "event"

type MC1Id = number | string

interface MC1Link {
    //id: number | string
    type: string
    weight: number
    key: string
    source: MC1Id
    target: MC1Id
}

interface NodeLinkData {
    type: LinkType,
    outs: number,
    ins: number,
    total: number
}

interface MC1Node {
    type?: NodeType
    country?: string
    id: MC1Id
    donut: NodeLinkData[]
}
