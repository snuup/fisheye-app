import { m } from '../app/model'
import { When, jsx } from '../jmx-lib/core'
import * as d3 from 'd3'
import { mount } from '../utils/common'
import { nodeColorScale } from '../utils/visuals'
import { NodeView } from './node-view'

export const GraphView = () => {
    console.log(m.graphfocus, m.graphfocusnode)

    return (
        <div id='graphview'>
            <div class='overlay'>
                <h2>graph view!</h2>
                {m.graphfocusnode && <NodeView n={m.graphfocusnode} />}
            </div>
            <NodeLinkView />
        </div>
    )
}

let simulation: any = null
const lineGenerator = d3.line()

const NodeLinkView = () => {
    function rund3(e) {

        let svg = e.querySelector('svg')
            ? d3.select(e).select('svg')
            : d3.select(e).append('svg')
        let svgdom = e.querySelector('svg')

        let w = svgdom.clientWidth
        let h = svgdom.clientHeight
        let hcenter = w / 2
        let vcenter = h / 2

        console.log(w, h)

        //simulation?.stop()

        let g = m.subgraph

        g.nodes.forEach(n => {
            n.x = w / 2 + Math.random() * 5
            n.y = w / 2 + Math.random() * 5
        })

        simulation = d3
            .forceSimulation(g.nodes)
            .force('charge', d3.forceCollide().radius(5).strength(1))
            //.force('charge', d3.forceManyBody().strength(-3000))
            // .force(
            //     'link',
            //     d3
            //         .forceLink(g.links)
            //         .id(d => (d as any).id)
            //         .distance(100)
            //         .strength(0.5)
            // )
            .force('r', d3.forceRadial(100, w / 2, w / 2).strength(3))
        //.force('center', d3.forceCenter(w / 2, h / 2))
        // .force('cluster', alpha => {
        //     if (g.nodes.length > 180) return // only cluster small graphs
        //     for (let [group, members] of groups.entries) {
        //         var k = (0.5 * alpha) / members.length
        //         for (let [a, b] of members.combinations) {
        //             let midx = (a.x + b.x) / 2
        //             let midy = (a.y + b.y) / 2
        //             a.x += (midx - a.x) * k
        //             b.x += (midx - b.x) * k
        //             a.y += (midy - a.y) * k
        //             b.y += (midy - b.y) * k
        //         }
        //     }
        // })

        mount({ simulation })

        // const link = svg
        //     .selectAll('path.link')
        //     .data(g.links)
        //     .join(
        //         enter =>
        //             enter
        //                 .append('path')
        //                 .attr('class', 'link')
        //                 .attr('class', d => d.type)
        //                 .attr('stroke-width', 2)
        //                 .attr('fill', 'none'),
        //         //.attr('opacity', d => d.weight)
        //         //.on("click", e => c.selectlink(e.target.__data__)),
        //         update => update,

        //         exit => exit.remove()
        //     )

        const node = svg
            .selectAll('text')
            .data(g.nodes, n => (n as any).id)
            .join(
                enter => {
                    let n = enter.append('g').call(drag(simulation))

                    n.append('circle')
                        .attr('r', 15)
                        .attr('fill', d =>
                            m.investigatees.includes(d.id)
                                ? 'red'
                                : nodeColorScale(d.type)
                        )
                        .attr('fill-opacity', d =>
                            m.investigatees.includes(d.id) ? 1 : 0.4
                        )
                        .attr('stroke-width', 4)
                        .attr('stroke', d =>
                            m.investigatees.includes(d) ? '#a33' : 'transparent'
                        )

                    n.append('text')
                        .attr('fill', '#333')
                        //     .attr("dx", 6)
                        .text(d => d.id10)

                    // n.on('click', e =>
                    //     c.selectnode(e.target.__data__, e.shiftKey)
                    // )

                    return n
                },
                update => {
                    //console.log("update", update)
                    return update
                        .style('stroke-color', 'red')
                        .style('stroke-width', 3)
                },
                exit => {
                    //console.log("exit", exit)
                    return exit.remove()
                }
            )

        //node.call(d3. drag)

        simulation.on('tick', () => {
            //node.attr('x', d => d.x)
            //node.attr('y', d => d.y)

            node.attr('transform', d => {
                //if (Number.isNaN(d.x)) debugger
                //if (Number.isNaN(d.y)) debugger
                return 'translate(' + d.x + ',' + d.y + ')'
            })
            // link.attr('d', d =>
            //     lineGenerator([
            //         [d.source.x, d.source.y],
            //         [d.target.x, d.target.y],
            //     ])
            // )
        })
    }

    return <div class='nodelink' patch={rund3} />
}

function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
    }

    function dragged(event) {
        event.subject.fx = event.x
        event.subject.fy = event.y
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
    }

    return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
}

// visualize that paths
