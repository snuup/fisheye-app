
export function mount(x) {
    Object.assign(globalThis, x)
}

export function mergePrototype(mixin, ...targets) {
    const props = Object.getOwnPropertyDescriptors(mixin.prototype)
    delete (props as any).constructor // do not copy the constructor
    targets.forEach((t) => {
        Object.defineProperties(t.prototype, props)
    })
}

mergePrototype(class extends Array {
    cast() { return this } // this is just for typescripts type safety
    countBy(selector): any {
        selector = selector ?? identity
        const f = (acc, x) => {
            let k = selector(x)
            acc[k] = (acc[k] ?? 0) + 1
            return acc
        }
        return this.reduce(f, {})
    }
    groupBy(selector): any {
        selector = selector ?? identity
        const f = (acc, x) => {
            let k = selector(x)
            acc[k] = acc[k] ?? []
            acc[k].push(x)
            return acc
        }
        return this.reduce(f, {})
    }
    sortBy(selector) {
        selector = selector ?? identity
        function comparefn(a, b) {
            a = selector(a)
            b = selector(b)
            let r = 0
            if (a < b) r = -1
            if (a > b) r = 1
            //console.log(`compare: "${a}" "${b}" = ${r}`)
            return r
        }
        return this.sort(comparefn)
    }
    get combinations() {
        return [...arraycombinations(this)]
    }
    distinctBy(selector) {
        selector = selector ?? identity
        let m = new Map(this.map(x => [selector(x), x]))
        return [...m.values()]
    }
    sumBy(selector) {
        selector = selector ?? identity
        return this.reduce((acc, b) => acc + selector(b), 0)
    }
    sortnumeric(selector) {
        selector = selector ?? identity
        return this.sort((a, b) => selector(a) - selector(b))
    }
    get first() {
        return this[0]
    }
    get last() {
        return this[this.length - 1]
    }
}, Array)

function* arraycombinations(arr) {
    let [h, ...t] = arr
    if (!h) return // termination
    for (let tt of t) yield [h, tt]
    for (let ht of arraycombinations(t)) yield ht
}

mergePrototype(class extends Object {
    get entries() {
        return Object.entries(this)
    }
    mapKeys(fmap) {
        return Object.fromEntries(this.entries.map(([k, v]) => [fmap(k), v]))
    }
}, Object)

mergePrototype(class extends String {
    truncate(n): string {
        return ((this.length > n) ? this.slice(0, n - 1) + "..." : this) as string
    }
}, String)



export function identity(x) { return x }

export function cc(...names): string {
    return names.flat().filter(identity).flatMap(n => (n.trim ? n : Object.keys(n).filter(k => n[k]))).join(' ') // n.trim detects strings
}
// declare global {
//   interface HTMLElement {
//       getParentByPredicate(predicate: (e: HTMLElement) => boolean): HTMLElement
//   }
// }
mergePrototype(class extends HTMLElement {
    set width(v) {
        this.style.width = `${v}px`
    }
    get width() {
        return parseInt(this.style.width)
    }
    getParentByPredicate(predicate: (e: HTMLElement) => boolean) {
        if (predicate(this)) return this
        return this.parentElement?.getParentByPredicate(predicate)
    }
    has(name: string) {
        return name in this || this.hasAttribute(name)
    }
    get(name: string) {
        return name in this ? this[name] : this.getAttribute(name)
    }
    hasClass(className: string): boolean { return this.classList.contains(className) }
    toggleClass(className: string) { return this.classList.toggle(className) }
    hide() { this.style.visibility = "hidden" }
    show() { this.style.visibility = "visible" }
    addClass(className: string, condition = true): HTMLElement {
        if (className && condition) this.classList.add(className)
        return this
    }
    remClass(className: string): HTMLElement {
        if (className) this.classList.remove(className)
        return this
    }
    setClass(className: string, active: boolean): HTMLElement {
        return active ? this.addClass(className) : this.remClass(className)
    }
    getNumAttr(name: string): number {
        return parseInt(this.getAttribute(name) ?? "0")
    }

}, HTMLElement)

mergePrototype(class extends Map {
    ensure(key, valuefactory) {
        if (!this.has(key)) this.set(key, valuefactory())
        return this.get(key)
    }
}, Map)

// -> jmx
export function initevents() {
    window.addEventListener("mousedown", ev => {
        // console.log("%cfmousedown", "background:lightBlue;color:white;padding:2px;font-weight:bold", ev.target)
        if (ev.target instanceof HTMLElement) {
            const e = ev.target.getParentByPredicate(ee => ee.has("fmousedown"))
            if (!e?.get("fmousedown")) return
            const ea = ev.target.getParentByPredicate(ee => ee.has("fargs"))
            const args = ea?.get("fargs")
            //    if (e?.fmousedown) console.log("real fmousedown", args)
            window.currentEvent = ev
            e?.fmousedown(args ?? ev)
            //if (e?.tagName == "A") { pushHistory() }
        }
    })
}


export function rebind(o) {
    const proto = Object.getPrototypeOf(o)
    const names =
        Object.entries(Object.getOwnPropertyDescriptors(proto))
            .filter(([, p]) => p.value instanceof Function)
            .filter(([name,]) => name != "constructor")
            .map(([name,]) => name)
    for (const name of names) {
        o[name] = o[name].bind(o)
    }
}
export function nicelinktypename(rawlinktype: string) {
    switch (rawlinktype) {
        case "membership": return "member"
        case "partnership": return "partner"
        case "family_relationship": return "family"
        case "ownership": return "owner"
        default: return rawlinktype
    }
}

export function nicenodetypename(rawnodetype: string) {
    //console.log("rawnodetype", `|${rawnodetype}|`)

    switch (rawnodetype) {
        case "": return "undefined"
        case "political_organization": return "political-org"
        default: return rawnodetype
    }
}
