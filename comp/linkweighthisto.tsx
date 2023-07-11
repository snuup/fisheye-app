import { jsx } from "../jmx-lib/core"
import * as d3 from "d3"
import { FishLink } from "../elements/fishlink"
import { mount } from "../utils/common"
import { mc1 } from "../data/data"

export const LinkHistogram = ({ links }: { links: FishLink[] }) => {

    let ruler = 0

    function rund3(e: HTMLElement) {
        {
            const bins = d3.bin<FishLink, number>()
                .thresholds(50)
                .value(d => d.weight)
                (links)

            mount({ bins })

            const width = e.clientWidth
            const height = e.clientHeight || 200
            const marginTop = 0
            const marginRight = 0
            const marginBottom = 0
            const marginLeft = 0

            console.log("link-histo", width, height)

            const x = d3.scaleLinear<number, number>()
                .domain([bins[0].x0!, bins[bins.length - 1].x1!])
                .range([marginLeft, width - marginRight])

            // Declare the y (vertical position) scale.
            const y = d3.scaleLinear()
                .domain([0, d3.max(bins, (d) => d.length as any)])
                .range([height - marginBottom, marginTop])

            const svg = d3
                .select(e)
                .append("svg")
                .attr("style", "max-width: 100%; height: auto;")
                .on('mousemove', (ev) => {
                    let dx = ev.x - e.offsetLeft + 3
                    ruler = x.invert(dx)
                    let totalcountbelow = bins.filter(bin => bin.x1! <= ruler).sumBy(bin => bin.length)
                    console.log(dx, ruler, totalcountbelow)
                    e.querySelector('.ruler')!.setAttribute('width', dx.toString())
                    e.querySelector('.rulervalue')!.textContent = `${totalcountbelow} (${ (totalcountbelow / mc1.links.length * 100).toFixed(2)}%)`
                })

            svg.append('rect')
                .attr('class', 'ruler')
                .attr('width', x(ruler).clamp(0))
                .attr('height', height)

            svg.append('text')
                .attr('class', 'rulervalue')
                .attr('x', 30)
                .attr('y', 55)

            // Add a rect for each bin.
            svg.append("g")
                .attr("fill", "#333")
                .selectAll()
                .data(bins)
                .join("rect")
                .attr("x", (d) => x(d.x0!) + 1)
                .attr("width", (d) => x(d.x1!) - x(d.x0!) - 1)
                .attr("y", (d) => y(d.length))
                .attr("height", (d) => y(0) - y(d.length))

            // Add the x-axis and label.
            svg.append("g")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x).tickValues([0.5, 0.8, 1]))
                .call((g) => g.append("text")
                    .attr("x", width)
                    .attr("y", marginBottom - 4)
                    //.attr("fill", "currentColor")
                    .attr("text-anchor", "end"))
            //.text("weights →"))

            // Add the y-axis and label, and remove the domain line.
            // svg.append("g")
            //     .attr("transform", `translate(${marginLeft},0)`)
            //     .call(d3.axisLeft(y).ticks(5))
            //     .call((g) => g.select(".domain").remove())
            //     .call((g) => g.append("text")
            //         .attr("x", -marginLeft)
            //         .attr("y", 10)
            //         //.attr("fill", "currentColor")
            //         .attr("text-anchor", "start")
            //         .text("↑ occurrencies"))
        }
    }

    return <div class="link-weights" patch={rund3} />
}