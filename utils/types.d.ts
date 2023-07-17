interface HTMLElement {
    getParentByPredicate(predicate: (e: HTMLElement) => boolean): HTMLElement
    toggleClass(className: string): boolean
    hasClass(className: string): boolean
    addClass(className: string, condition?: boolean): HTMLElement // setClass will call remClass if condition is false, while addClass does nothing
    setClass(className: string, condition: boolean): HTMLElement
    remClass(className: string): HTMLElement
    hide(): void
    show(): void
    get(name: string): any
    has(name: string): boolean
    fclick?: any
    fsubmit?: any
    fmousedown?: any
    fargs?: any
}

interface Array<T> {
    exceptset(exceptions: Set<any>): T[]
    except(...exceptions: any[]): T[]
    countBy(selector?: (x: T) => string): { [key: string]: number }
    groupBy(selector: (x: T) => string | undefined): { [key: string | undefined]: T[] }
    sortBy(selector: (x: T) => U): T[]
    sortWithUndefinedLast(): T[]
    distinct(selector?): T[]
    get combinations(): T[]
    sumBy(selector?: (x: T) => number): number
    max(): number
    get average(): number
    sortnumeric(selector): Array<T>
    sortauto(): Array<T>
    get first(): T
    get last(): T
    toReversed(): T[]
    cross(other?: Array<T>): Array<[T, T]>
    remove(...x: T[])
    removeif(pred: (T) => boolean): T[]
    toggle(x, addOrRemove?: boolean): boolean
    ensure(x)
    ensures(xs)
    get cumulativeSum(): number[]
}

interface Set<T> {
    get head(): T
}

interface Number {
    clamp(min?: number, max?: number)
}

interface Map<K, V> {
    getorcreate(key: K, valuefactory: () => V): V
}

interface Object {
    print()
    get entries(): [string, any][]
    get entrieskv<T>(): { k: string, v: T }[]
    get keys(): string[]
    values<T>(this: { [s: string]: T }): T[]
    mapKeys(fmap: (string) => string): any
    mapValues(fmap: (any) => any): any
    filterByValue<T>(this: T, f: (string) => boolean): T

    //get entries(this: { [s: string]: T } | ArrayLike<T>): [string, ThisType<T>][];
    //get entries(): [string, ThisType<T>][];
}

interface String {
    truncate(n: number): string
}

type Action = () => void

interface Window {
    [key: string]: any
}

interface INode {
    id: string
}

interface ILink {
    source: string
    target: string
    type: string
    weight: number

    //key: string
    text: string

    nodeids: [string, string]
}

interface IGraph<N extends INode, L extends ILinkType> {
    nodes: N[]
    links: L[]
    getoutlinks(nid: string): L[]
    getinlinks(nid: string): L[]
}
