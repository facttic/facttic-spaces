const venn = require('@upsetjs/venn.js')
const d3 = require('d3')
const { sets } = require('../data/spaces.json')

const chart = venn
  .VennDiagram({ symmetricalTextCentre: true })
  // .wrap(false)
  .fontSize('14px')
  .width(1200)
  .height(1200)

const div = d3.select('#venn').datum(sets)
const layout = chart(div)
const { textCentres } = layout

div.selectAll('.label').style('fill', '#272626')
div.selectAll('.venn-circle path').style('fill-opacity', 0.6)

// horario
layout.enter
  .append('text')
  .text((d) => d.hour || '')
  .style('fill', '#666')
  .style('font-size', '10px')
  .attr('text-anchor', 'middle')
  .attr('dy', (d) => {
    lines = div
      .selectAll(`g[data-venn-sets="${d.sets.join('_')}"]`)
      .selectAll('text tspan')
      .size()
    return `${18 * lines}`
  })
  .attr('x', (d) => Math.floor(textCentres[d.sets].x))
  .attr('y', (d) => Math.floor(textCentres[d.sets].y))

// link a la sala
layout.enter
  .append('a')
  .attr('xlink:href', (d) => d.link)
  .attr('target', '_blank')
  .append('text')
  .text((d) => (d.link ? '(Sala^)' : ''))
  .style('fill', '#666')
  .style('font-size', '10px')
  .attr('text-anchor', 'middle')
  .attr('dy', (d) => {
    lines = div
      .selectAll(`g[data-venn-sets="${d.sets.join('_')}"]`)
      .selectAll('text tspan')
      .size()
    return `${18 * (lines + 1)}`
  })
  .attr('x', function (d) {
    return Math.floor(textCentres[d.sets].x)
  })
  .attr('y', function (d) {
    return Math.floor(textCentres[d.sets].y)
  })

const tooltip = d3.select('body').append('div').attr('class', 'venntooltip')

div
  .selectAll('path')
  .style('stroke-opacity', 0)
  .style('stroke', '#fff')
  .style('stroke-width', 3)

div
  .selectAll('g')
  .on('mouseover', function (d) {
    // sort all the areas relative to the current item
    venn.sortAreas(div, d)

    // Display a tooltip with the current size
    tooltip.transition().duration(400).style('opacity', 0.9)
    tooltip.text(
      d.desc
        ? `${d.desc} (participan ${d.size} personas)`
        : `vínculo de ${d.size} personas`,
    )

    // highlight the current path
    const selection = d3.select(this).transition('tooltip').duration(400)
    selection
      .select('path')
      .style('fill-opacity', d.sets.length == 1 ? 0.4 : 0.1)
      .style('stroke-opacity', 1)
  })

  .on('mousemove', function () {
    tooltip
      .style('left', d3.event.pageX + 'px')
      .style('top', d3.event.pageY - 28 + 'px')
  })

  .on('mouseout', function (d) {
    tooltip.transition().duration(400).style('opacity', 0)
    const selection = d3.select(this).transition('tooltip').duration(400)
    selection
      .select('path')
      .style('fill-opacity', d.sets.length == 1 ? 0.25 : 0.0)
      .style('stroke-opacity', 0)
  })

// }

// add/remove set areas to showcase transitions
// updateVenn(sets)

// let i = 1,
//   direction = 1

// const interval = window.setInterval(function () {
//   i += direction
//   if (i >= sets.length) {
//     window.clearInterval(interval)
//   } else if (i <= 1) {
//     direction = 1
//   }
//   updateVenn(sets.slice(0, i))
// }, 1500)
