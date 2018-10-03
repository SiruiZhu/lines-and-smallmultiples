import * as d3 from 'd3'

// I'll give you margins/height/width
var margin = { top: 100, left: 10, right: 10, bottom: 30 }
var height = 500 - margin.top - margin.bottom
var width = 400 - margin.left - margin.right

// And grabbing your container
var container = d3.select('#chart-4')

// Create your scales
const xPositionScale = d3
  .scaleLinear()
  .domain([-6, -3, 0, 3, 6])
  .range(['Extremely Cold', 'Cold', 'Normal', 'Hot', 'Extremely Hot'])

const yPositionScale = d3.scaleLinear().range([height, 0])

// Create your area generator
var area = d3
  .area()
  .x(d => xPositionScale(d.diff))
  .y1(d => yPositionScale(d.freq))
  .y0(d => yPositionScale(0))

// Read in your data, then call ready
d3.tsv(require('./climate-data.tsv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Write your ready function
function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.year
    })
    .entries(datapoints)
  console.log('nested data look like', nested)

  var frequency = datapoints.map(d => +d.freq)

  // Calculate max from that list
  yPositionScale.domain(d3.extent(frequency))

  console.log('maxFreq look like', frequency)

  // container
  //   .selectAll('.climate-graph')
  //   .data(datapoints)
}
