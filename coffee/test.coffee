
{three, four} = require "./three_quarter"

{bend} = require "./bend"

p1 = x: -150, y: 0, z: 0
p2 = x: -10, y: 0, z: 20
p3 = x: 0, y: 120, z: 0
p4 = x: 10, y: 0, z: -20
p5 = x: 150, y: 0, z: 0

data = [p1, p2, p3, p4, p5].map four
fix = (a) -> a.toFixed 1

exports.test_line = ->
  result = data
  [1..4].forEach ->
    result = bend result, data

  # require('./format.coffee').list result 
  result