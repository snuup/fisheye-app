import { jsx } from "../jmx-lib/core"
import { cc } from "../utils/common"
import { m } from "./model"

export type Url =
    ["/"] |
    ["nodestats"] |
    ["matrix"] |
    ["network", string?] |
    ["linkstats", string?] |
    ["tree", string?]

export const Link = ({ url }: { url: Url }) => <a href={'/' + url.join('/')} class={cc({ selected: url[0] === m.url[0] })}>{url[0]}</a>