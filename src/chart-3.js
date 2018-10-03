import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 40, left: 40, right: 40, bottom: 40 }

var height = 300 - margin.top - margin.bottom

var width = 230 - margin.left - margin.right
// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales
const xPositionScale = d3.scalePoint().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
var line_global = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))

var line_usa = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))

// Read in your data
Promise.all([
  d3.csv(require('./middle-class-income-usa.csv')),
  d3.csv(require('./middle-class-income.csv'))
])
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Create your ready function
function ready([datapointsUSA, datapointsGlobal]) {
  console.log(datapointsUSA)

  // group global data by country, don't need to do this for usa file.
  var nested_global = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(datapointsGlobal)
  console.log('nested global data look like', nested_global)

  const years_usa = datapointsUSA.map(function(d) {
    return d.year
  })

  xPositionScale.domain(years_usa)

  container
    .selectAll('.income-graph')
    .data(nested_global)
    .enter()
    .append('svg')
    .attr('class', 'income-graph')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      var svg = d3.select(this)
      var datapoints = d.values

      svg
        .append('path')
        .datum(datapoints)
        .attr('stroke-width', 2)
        .attr('stroke', '#980043')
        .attr('fill', 'none')
        .attr('d', line_global)
        .lower()

      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('stroke-width', 2)
        .attr('stroke', '#737373')
        .attr('fill', 'none')
        .attr('d', line_usa)
        .lower()

      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 15)
        .attr('font-weight', 'bold')
        .attr('fill', '#980043')
        .attr('dy', -15)
        .attr('text-anchor', 'middle')

      svg
        .append('text')
        .text('USA')
        .attr('x', (width * 1) / 6)
        .attr('y', 0)
        .attr('font-size', 13)
        .attr('font-weight', 'bold')
        .attr('fill', '#737373')
        .attr('dy', 20)
        .attr('text-anchor', 'start')

      // Add axes for every svg
      var xAxis = d3
        .axisBottom(xPositionScale)
        .tickValues([1980, 1990, 2000, 2010])
        .tickSize(-height)
        .tickFormat(d3.format('d'))

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      svg
        .selectAll('.x-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')
        .attr('fill', '#bdbdbd')

      var yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(4)
        .tickSize(-width)
        .tickFormat(d3.format('$,d'))
        .tickValues([5000, 10000, 15000, 20000])

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)


      svg
        .selectAll('.y-axis line')
        .attr('stroke-dasharray', '2 3')
        .attr('stroke-linecap', 'round')
        .attr('fill', '#bdbdbd')
      svg.select('.axis').lower()
      svg.selectAll('.domain').remove()
    })
}
export {
  xPositionScale,
  yPositionScale,
  width,
  height
}
