import { getPathsHierarchy } from '../comp/hierarchyview'
import * as d3 from '../lib/d3'
import { mount } from '../utils/common'
import { Controller } from './controller'
import { m } from './model'

let c = new Controller()
c.setfocus("Amanda Mckenzie")
let data = getPathsHierarchy()
let root = d3.hierarchy(data)

const width = 1000
const height = 500

let layout = d3.cluster().size([width, height -20]).nodeSize([5, 150])
layout(root)

mount({ m, data, root, layout })

const svg = d3.select(document.body)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    //.attr("viewBox", [-dy / 3, x0 - dx, width, height])
    .attr("style", "height: auto; font: 10px sans-serif;");

const link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll()
    .data(root.links())
    .join("path")
    .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

const node = svg.append("g")
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll()
    .data(root.descendants())
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

node.append("circle")
    .attr("fill", d => d.children ? "#555" : "#999")
    .attr("r", 2.5);

node.append("text")
    .attr("dy", "0.31em")
    .attr("x", d => d.children ? -6 : 6)
    .attr("text-anchor", d => d.children ? "end" : "start")
    .text(d => d.data.name)
    .clone(true).lower()
    .attr("stroke", "white");
