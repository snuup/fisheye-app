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

mount({ issuspicious, words2 })