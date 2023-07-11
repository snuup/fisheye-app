

export class LinkController {

    callbacks = [] as ((string, boolean) => void)[]
    selection = ""

    register(select: (string, boolean) => void) {
        this.callbacks.push(select)
    }

    select(connects: string) {
        console.log("select", connects)
        if (this.selection) this.callbacks.forEach(cb => cb(this.selection, false))
        this.callbacks.forEach(cb => cb(this.selection = connects, true))
    }
}