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

export function issuspicious(id: string) {
    return suspicious_words.find(s => id.includes(s))
}

mount({ issuspicious })