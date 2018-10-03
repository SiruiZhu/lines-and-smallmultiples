import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 60, left: 40, right: 120, bottom: 40 }

var height = 800 - margin.top - margin.bottom

var width = 600 - margin.left - margin.right

// Add your svg
var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
// Create a time parser (see hints)
let parseTime = d3.timeParse('%B-%y')

// Create your scales
var xPositionScale = d3.scaleLinear().range([0, width])
var yPositionScale = d3.scaleLinear().range([height, 0])
var colorScale = d3
  .scaleOrdinal()
  .range([
    '#67001f',
    '#980043',
    '#e7298a',
    '#3f007d',
    '#807dba',
    '#08519c',
    '#6baed6',
    '#006837',
    '#78c679',
    '#ec7014'
  ])

// Create a d3.line function that uses your scales
var line = d3
  .line()
  .x(d => xPositionScale(d.datetime))
  .y(d => yPositionScale(d.price))

// Read in your housing price data
d3.csv(require('./housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Write your ready function
function ready(datapoints) {
  console.log(datapoints)
  // Convert your months to dates
  datapoints.forEach(function(d) {
    // console.log(d)
    d.datetime = parseTime(d.month)
  })

  // Get a list of dates and a list of prices
  const dates = datapoints.map(d => +d.datetime)
  xPositionScale.domain(d3.extent(dates))

  console.log(dates)

  const prices = datapoints.map(function(d) {
    return +d.price
  })
  yPositionScale.domain(d3.extent(prices))

  // Group your data together
  var nested = d3
    .nest()
    .key(d => d.region)
    .entries(datapoints)

  console.log('nested data look like', nested)

  // Draw your lines
  svg
    .selectAll('.price-line')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'price-line')
    .attr('stroke', d => {
      return colorScale(d.key)
    })
    .attr('stroke-width', 2)
    .attr('d', d => {
      return line(d.values)
    })
    .attr('fill', 'none')

  // add circles for the lastest day
  svg
    .selectAll('.price-circle')
    .data(nested)
    .enter()
    .append('circle')
    .attr('class', 'price-circle')
    .attr('r', 5)
    .attr('cx', d => {
      console.log(d)
      return xPositionScale(d.values[0].datetime)
    })
    .attr('cy', d => {
      return yPositionScale(d.values[0].price)
    })
    .attr('fill', d => {
      return colorScale(d.key)
    })
  // add text for lines
  svg
    .selectAll('.text-line')
    .data(nested)
    .enter()
    .append('text')
    .text(d => d.key)
    .attr('x', d => {
      return xPositionScale(d.values[0].datetime)
    })
    .attr('y', d => {
      return yPositionScale(d.values[0].price)
    })
    .attr('font-size', 12)
    .attr('dx', 10)
    .attr('alignment-baseline', 'middle')

  // Make a rectangle hightlight winter period
  let december_16 = parseTime('December-16')
  let february_17 = parseTime('February-17')
  svg
    .selectAll('.hightlight-rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('fill', '#bdbdbd')
    .attr('opacity', 0.1)
    .attr('x', xPositionScale(december_16))
    .attr('y', yPositionScale(d3.max(prices)))
    .attr('width', xPositionScale(february_17) - xPositionScale(december_16))
    .attr('height', height)
    .lower()

  // Set the title
  svg
    .append('text')
    .attr('class', 'title-text')
    .text('U.S housing prices fall in winter')
    .attr('x', 250)
    .attr('y', -50)
    .attr('font-size', 28)
    .attr('dy', 20)
    // .attr('font-weight', 'bold')
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')

  // Add your axes
  var xAxis = d3.axisBottom(xPositionScale).tickFormat(d3.timeFormat('%b %Y'))
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}

export {
  xPositionScale,
  yPositionScale,
  colorScale,
  line,
  width,
  height,
  parseTime
}
