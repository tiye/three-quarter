
{three, four} = require "./three_quarter"

{bend} = require "./bend"

point_1 =
  x: -20
  y: -30
  z: -40

point_2 =
  x: -10
  y: 4
  z: 0

point_3 =
  x: 30
  y: 30
  z: 30

point_4 =
  x: 20
  y: 40
  z: 30

point_5 =
  x: 40
  y: 40
  z: 40

data = [point_1, point_2, point_3, point_4].map four
fix = (a) -> a.toFixed 1

exports.test = ->
  console.log "test!"
  console.log data
  result = data
  result = bend result, data
  result = bend result, data
  result = bend result, data
  # result = bend result, data
  # result = bend result, data
  # result = bend result, data
  # result.forEach (p) ->
  #   console.log (fix p.x), (fix p.y), (fix p.z), p.w

  result