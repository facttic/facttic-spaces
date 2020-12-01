const venn = require('@upsetjs/venn.js')
const d3 = require('d3')
const { sets } = require('../data/spaces.json')

const chart = venn.VennDiagram().width(900).height(900)

const div = d3.select('#venn')
div.datum(sets).call(chart)

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
    tooltip.text(d.size + ' users')

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
