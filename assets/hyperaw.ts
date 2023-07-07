export function h(tag, attrs, ...children) {
    return (tag === hf) ?
        children.flat() // fragment
        :
        { tag, attrs, children } // element
}

export function hf() { } // marker function, never called

export function create(o, ns?: string) {
    switch (typeof o) {
        case "string":
        case "number":
            return document.createTextNode(o?.toString())
        case "object":
            const { tag, attrs, children } = o
            if (typeof tag == "function") {
                return create(tag(attrs))
            }
            else {
                ns = attrs?.xmlns ?? ns
                const e = ns ? document.createElementNS(ns, tag) : document.createElement(tag)
                attrs && Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v))
                children
                    .flat()
                    .map(c => create(c, ns))
                    .filter(x => !!x)
                    .forEach((c) => { e.appendChild(c) })
                return e
            }
    }
}

export function createDom(e) {
    // if the vdom is a fragement, then e is an array
    return Array.isArray(e) ?
        [e].flat().map(e => create(e)) // do *not* abbreviate e => create(e) with create, it is wrong! map((x,i))!
        :
        create(e)
}
