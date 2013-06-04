
{three, four} = require "./three_quarter.coffee"

{bend} = require "./bend.coffee"

p1 = x: -150, y: 0, z: 0
p2 = x: -10, y: 0, z: 0
p3 = x: -50, y: 100, z: 40
p4 = x: 0, y: 0, z: 0
p5 = x: 50, y: 100, z: -40
p6 = x: 10, y: 0, z: 0
p7 = x: 150, y: 0, z: 0

data = [p1, p2, p3, p4, p5, p6, p7].map four
fix = (a) -> a.toFixed 1

exports.test_line = ->
  result = data
  [1..4].forEach ->
    result = bend result, data

  # require('./format.coffee').list result 
  result