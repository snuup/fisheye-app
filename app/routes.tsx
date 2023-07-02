import { jsx } from "../jmx-lib/core"

export type Url =
    ["/"] |
    ["nodestats"] |
    ["matrix"] |
    ["network", string?] |
    ["linkstats", string?] |
    ["tree", string?]

export const Link = ({ url }: { url: Url }) => <a href={'/' + url.join('/')}>{url[0]}</a>