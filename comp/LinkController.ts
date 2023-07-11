

export class LinkController {
    // root: HTMLElement
    // current: string
    comps = [] as HTMLElement[]
    selections = [] as HTMLElement[]

    constructor() {
        console.log("LinkController")
    }

    register(comp: HTMLElement) {
        console.log("register", comp)
        this.comps.push(comp)
    }

    select(comp: HTMLElement, connects: string) {
        console.log(connects)

        this.selections.forEach(sel => sel.classList.remove("sel"))

        let sel = this.other(comp).querySelector("." + connects) as HTMLElement | null
        if (sel === null) return
        this.selections.push(sel)
        sel.classList.add("sel")

        //this.root.classList.remove(this.current)
        //this.current = connects
    }

    other(comp: HTMLElement) { return this.comps.filter(c => c != comp).first }
}