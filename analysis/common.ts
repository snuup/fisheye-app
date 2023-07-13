import { FishNode } from "../elements/fishnode"
import { mount } from "../utils/common"

export const cleanid = (id) => typeof id === "number" ? "n" + id : id

let suspicious_words = [
    'victim',
    'perpetrator',
    'spy',
    'thief',
    'poached',
    'mining',
    'snitch',
    'broker',
    'help',
    'narcotics',
    'bitcoin',
    'heroin',
    'cocaine',
    'smuggling',
    'contraband',
    'illegal',
    'crime',
    'criminal',
    'drug'
]

let words2 = `
    Attorneys
    Bitcoin
    Bribes
    coastguard
    Cocaine
    Contraband
    Crime
    criminally
    Defendants
    devil
    Disastrous
    Exploitation
    Explosives
    Firearms
    Folly
    Guard
    Guilty
    Heroin
    Hoover
    Hunt
    Hunter
    illegal
    Illegal
    Illegal
    Islands
    Lobster
    mining
    Narcotics
    perpetrator
    poached
    Refugee
    Robbery
    Smuggling
    Snapper
    snitch
    Sparks
    Spy
    Supreme
    Survivorsâ
    Sword
    transshipment
    Trials
    unregulated
    victim
    Viking
    Warships
    wheeler
    Wheeler
    wheelers
    zombie
    Amanda Mckenzie
    `

let ws = words2.split("\n").map(s => s.trim()).filter(s => s !== "")

export function issuspicious(id: string) {
    return ws.find(s => id.includes(s))
}

export function getlinkgroupkey(sourcenodetype: NodeType, targetnodetype: NodeType): string {
    return sourcenodetype + "-" + targetnodetype
}

export const getconnects = ({ st, tt }) => getlinkgroupkey(st, tt)
export const splitconnects = (connects) => connects.split('-')

export const linktypes: LinkType[] = [
    "partnership",
    "family_relationship",
    "membership",
    "ownership"
]

export const nodetypes: NodeType[] = [
    "company",
    "event",
    "location",
    "organization",
    "movement",
    "person",
    "political_organization",
    "vessel",
    undefined
]

mount({ linktypes, nodetypes })

export function nicenodetype(type: NodeType): string {
    switch (type) {
        case "political_organization": return "pol-org"
        case undefined: return "undefined"
        default: return type
    }
}

export function nicelinktype(l: LinkType): string { return l.replace(/_/, "-") }


mount({ issuspicious, words2 })