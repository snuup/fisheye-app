import { jsx, jsxf } from "../jmx-lib/core"
import * as d3 from 'd3'
import { cc, makekv } from "../utils/common"

export function NameValue({ name, value, percent }: { name: string, value?: number | string, percent?: number }) {
    return (
        <>
            <label>{name}</label>
            <div class="value">
                <span class={cc({ bar: percent !== undefined })} style={(percent !== undefined) ? `width:${percent}%` : undefined}>{value?.toString() ?? "-"}</span>
            </div>
        </>)
}

export const ObjectAsTable = ({ o, multiplier, showbars }: { o: { [key: string]: number }, multiplier?: number, showbars?: undefined | true }) => {
    multiplier ??= 1
    let scaler = d3.scaleLinear([0, Object.values(o).max()], [0, 100 * multiplier])
    return (
        <div class="gridtable">
            {Object.entries(o).map(makekv)
                .sortBy(({ v }) => -v)
                .map(({ k, v }) => <NameValue name={k} value={v} percent={showbars ? scaler(v) : undefined} />)
            }
        </div>
    )
}
