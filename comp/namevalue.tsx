import { jsx } from "../jmx-lib/core"

export function NameValue({ name, value }: { name: string, value?: number | string }, { children }) {
    console.log("nv", children, children())
    let cn = children()
    if (!cn.length && value === undefined) return null
    return (
        <div class="namevalue">
            <label>{name}</label>
            {cn.length ? cn : <span class="value">{value?.toString() ?? "-"}</span>}
        </div>)
}