import { jsx } from "../jmx-lib/core"

export type Url =
    ["/"] |
    ["stats"] |
    ["matrix"] |
    ["graph", string?] |
    ["links", string?] |
    ["tree", string?]

export const Link = ({ url }: { url: Url }) => <a href={'/' + url.join('/')}>{url[0]}</a>