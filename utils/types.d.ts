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
    countBy(selector: (x: T) => string): { [key: string]: number }
    groupBy(selector: (x: T) => string | undefined): { [key: string | undefined]: T[] }
    sortBy(selector: (x: T) => U): T[]
    sortWithUndefinedLast(): T[]
    distinctBy(selector?): T[]
    get combinations(): T[]
    sumBy(selector: (x: T) => number): number
    get average(): number
    sortnumeric(selector): Array<T>
    get first(): T
    get last(): T
    toReversed(): T[]
    cross(other?: Array<T>) : Array<[T, T]>
    remove(x:T)
    toggle(x): boolean
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
    get entries(): [string, any][]
    get keys(): string[]
    get values(): any[]
    mapKeys(fmap: (string) => string): any
    mapValues(fmap: (any) => any): any
    //fullclone(): any
    //get entries(o: { [s: string]: T } | ArrayLike<T>): [string, ThisType<T>][];
    //get entries(): [string, ThisType<T>][];
}

interface String {
    truncate(n: number): string
}

type Action = () => void

interface Window {
    [key: string]: any
}

// mc1

type MC1Id = number | string

interface MC1Link {
    //id: number | string
    type: string
    weight: number
    key: string
    source: MC1Id
    target: MC1Id
}

interface MC1Node {
    type?: string
    country?: string
    id: MC1Id
}