import { jsx } from "../jmx-lib/core"
import { cc } from "../utils/common"
import { m } from "./model"

export type Url =
    ["/"] |
    ["nodestats"] |
    ["linkstats", string?] |
    ["graphstats", string?] |
    ["matrix"] |
    ["network", string?] |
    ["tree", string?]

export const Link = ({ url }: { url: Url }) => <a href={'./' + url.join('/')} class={cc({ selected: url[1] === m.url[1] })}>{url[0]}</a>