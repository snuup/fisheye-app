import * as d3 from '../lib/d3'
import { mount } from '../utils/common'

let layout = d3.cluster()

let data = {
    name: 'hase',
    children: [
        { name: 'aaa' },
        { name: 'bbb', children: [{ name: 'fff' }, { name: 'ggg' }] },
        { name: 'ccc' },
    ],
}

let h = d3.hierarchy(data)

mount({ data, layout, h, d3 })

//let chart = {
// Specify the chart’s dimensions.
const width = document.body.clientWidth * 0.7
const height = width
const cx = width * 0.5 // adjust as needed to fit
const cy = height * 0.54 // adjust as needed to fit
const radius = 250

// Create a radial cluster layout. The layout’s first dimension (x)
// is the angle, while the second (y) is the radius.
const tree = d3
    .cluster()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth)

// Sort the tree and apply the layout.
const root = tree(
    d3.hierarchy(data).sort((a, b) => d3.ascending(a.data.name, b.data.name))
)

console.log(-cx, -cy, width, height)

mount({ root })

// Creates the SVG container.
const svg = d3
    .select(document.body)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [-cx, -cy - 100, width, height])
    .attr('style', 'height: auto; font: 10px sans-serif;')

// Append links.
svg.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5)
    .selectAll()
    .data(root.links())
    .join('path')
    .attr(
        'd',
        d3
            .linkRadial()
            .angle(d => d.x)
            .radius(d => d.y)
    )

// Append nodes.
svg.append('g')
    .selectAll()
    .data(root.descendants())
    .join('circle')
    .attr(
        'transform',
        d => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
    )
    .attr('fill', d => (d.children ? 'green' : 'red'))
    .attr('r', 5)

// Append labels.
svg.append('g')
    //.attr("stroke-linejoin", "round")
    //.attr("stroke-width", 3)
    .selectAll()
    .data(root.descendants())
    .join('text')
    .attr(
        'transform',
        d =>
            `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0) rotate(${
                d.x >= Math.PI ? 180 : 0
            })`
    )
    .attr('dy', '0.31em')
    .attr('x', d => (d.x < Math.PI === !d.children ? 6 : -6))
    .attr('text-anchor', d => (d.x < Math.PI === !d.children ? 'start' : 'end'))
    .attr('paint-order', 'stroke')
    .attr('stroke', 'lightcoral')
    .attr('fill', 'currentColor')
    .text(d => d.data.name)

// return svg.node();
// }

//console.log(svg);

//document.body.appendChild(svg.node())
