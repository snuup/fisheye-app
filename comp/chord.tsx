import { FishLink } from "../analysis/fishlink"
import { jsx } from "../jmx-lib/core"

export const ChordForType = ({ links }: { links: FishLink[] }) => {

    function rund3(tableDom: HTMLTableElement) {
        {
            console.log("chord", links)
        }
    }

    return (
        <div>
            <table patch={rund3} />
            <div>chord</div>
        </div>)
}