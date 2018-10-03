import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 40, left: 40, right: 40, bottom: 40 }

var height = 150 - margin.top - margin.bottom

var width = 140 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([10, 60])
  .range([0, width])
const yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.area function that uses your scales
var area1 = d3
  .area()
  .x(d => xPositionScale(d.Age))
  .y1(d => yPositionScale(d.ASFR_jp))
  .y0(d => yPositionScale(0))

var area2 = d3
  .area()
  .x(d => xPositionScale(d.Age))
  .y1(d => yPositionScale(d.ASFR_us))
  .y0(d => yPositionScale(0))

// Read in your data
d3.csv(require('./fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)
  console.log('nested data look like', nested)

  console.log('data look like', datapoints)

  container
    .selectAll('.fertility-graph')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'fertility-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      var svg = d3.select(this)
      var datapoints = d.values
      let sum_jp = d3.sum(datapoints, d => +d.ASFR_jp).toFixed(2)
      let sum_us = d3.sum(datapoints, d => +d.ASFR_us).toFixed(2)

      console.log('Japan Total value is', sum_jp)
      console.log('US Total value is', sum_us)
      // add areas
      svg
        .append('path')
        .datum(datapoints)
        .attr('d', area1)
        .attr('stroke', 'red')
        .style('fill', 'red')
        .attr('opacity', 0.4)

      svg
        .append('path')
        .datum(datapoints)
        .attr('d', area2)
        .attr('stroke', 'blue')
        .style('fill', 'blue')
        .attr('opacity', 0.4)

      // add text of "year"
      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('dy', -10)
        .attr('text-anchor', 'middle')

      // sum for Japan
      svg
        .append('text')
        .text(sum_jp)
        .attr('x', (width * 3) / 4)
        .attr('y', 0)
        .attr('font-size', 10)
        .attr('dy', 20)
        .attr('fill', 'red')
        .attr('text-anchor', 'middle')

      svg
        .append('text')
        .text(sum_us)
        .attr('x', (width * 3) / 4)
        .attr('y', 0)
        .attr('font-size', 10)
        .attr('dy', 30)
        .attr('fill', 'blue')
        .attr('text-anchor', 'middle')

      // Add axes for every svg
      var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      var yAxis = d3.axisLeft(yPositionScale).tickValues([0, 0.1, 0.2, 0.3])

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
export { xPositionScale, yPositionScale, width, height }
