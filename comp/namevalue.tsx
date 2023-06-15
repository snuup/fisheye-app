import { jsx, jsxf } from "../jmx-lib/core"
import { cc } from "../utils/common"

export function NameValue({ name, value, className }: { name: string, value?: number | string, className?: string }, { children }) {
    let cn = children()
    if (!cn.length && value === undefined) return null
    return (
        <>
            <label>{name}</label>
            {cn.length ? cn : <span class="value">{value?.toString() ?? "-"}</span>}
        </>)
}