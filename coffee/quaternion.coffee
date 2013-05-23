
plus = (a, b) ->
  x: a.x + b.x
  y: a.y + b.y
  z: a.z + b.z
  w: a.w + b.w

minus = (a, b) ->
  x: a.x - b.x
  y: a.y - b.y
  z: a.z - b.z
  w: a.w - b.w

# y * z == w
# z * w => z * y * z => - z * z * y => y
# w * y => y * z * y => z
# y * z * w => w * w => -1
multiply = (a, b) ->
  x: (a.x * b.x) - (a.y * b.y) - (a.z * b.z) - (a.w * b.w)
  y: (a.x * b.y) + (a.y * b.x) + (a.z * b.w) - (a.w * b.z)
  z: (a.x * b.z) + (a.z * b.x) + (a.w * b.y) - (a.y * b.w)
  w: (a.x * b.w) + (a.w * b.x) + (a.y * b.z) - (a.z * b.y)

conjugate = (a) ->
  x: a.x
  y: - a.y
  z: - a.z
  w: - a.w

square = (a) -> a * a
sum4Square = (a) ->
  s4 = square
  (s4 a.x) + (s4 a.y) + (s4 a.z) + (s4 a.w)

length2 = (a) -> sum4Square a

norm = (a) -> Math.pow (length2 a), 0.5

divide = (a, b) ->
  c = conjugate b
  d = multiply a, c
  realPart = norm d
  # normally use sum4Square, but a trick to be obvious
  if realPart is 0
    x: 0, y: 0, z: 0, w: 0
  else
    x: d.x / realPart
    y: d.y / realPart
    z: d.z / realPart
    w: d.z / realPart

exports.plus = plus
exports.minus = minus
exports.multiply = multiply
exports.divide = divide
exports.norm = norm
exports.length2 = length2