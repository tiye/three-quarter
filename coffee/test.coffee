
{three, four} = require "./three_quarter"

{bend} = require "./bend"

p1 = x: -200, y: 0, z: 0
p2 = x: 0, y: 0, z: 0
p3 = x: 0, y: 114, z: -114
p4 = x: 0, y: 0, z: 0
p5 = x: 0, y: 114, z: 114
p6 = x: 0, y: 0, z: 0
p7 = x: 200, y: 0, z: 0

data = [p1, p2, p3, p4, p5, p6, p7].map four
fix = (a) -> a.toFixed 1

exports.test_line = ->
  result = data
  [1..5].forEach -> result = bend result, data

  # require('./format.coffee').list result 
  result