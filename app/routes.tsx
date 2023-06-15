import { jsx } from "jmx/core"

export type Url =
    ["/"] |
    ["stats"] |
    ["graph", string?]
    
export const Link = ({ url }: { url: Url }) => <a href={'/' + url.join('/')}>{url[0]}</a>