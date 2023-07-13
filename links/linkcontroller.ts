import { rebind } from "../utils/common"

export class LinkController {

    e: HTMLElement
    callbacks = [] as ((selections: string[], select: boolean) => void)[]
    selection = [] as string[]

    constructor() { rebind(this) }

    register(e: HTMLElement, select: (string, boolean) => void) {
        this.e = e
        this.callbacks.push(select)
        window.addEventListener("mousedown", this.deselect)
    }

    select(connects: string[], multiselect?: boolean) {
        //console.log("select", connects)
        this.deselectall()
        this.callbacks.forEach(cb => cb(this.selection = connects, true))
    }

    deselectall(){
        if (!this.selection) return
        this.callbacks.forEach(cb => cb(this.selection, false))
    }

    deselect() {
        //console.log("deselect", this.selection)
        if (!this.e.isConnected) return window.removeEventListener("mousedown", this.deselect)
        this.deselectall()
    }
}