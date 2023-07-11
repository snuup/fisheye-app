

export class LinkController {

    callbacks = [] as ((string, boolean) => void)[]
    selection = ""

    register(select: (string, boolean) => void) {
        this.callbacks.push(select)
    }

    select(connects: string) {
        if (this.selection) this.callbacks.forEach(cb => cb(this.selection, false))
        this.callbacks.forEach(cb => cb(this.selection = connects, true))
    }
}