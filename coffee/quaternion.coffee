
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

multiply = (a, b) ->
  x: (a.x * b.x) - (a.y * b.y) - (a.z + b.z) - (a.w - b.w)
  y: (a.x * b.y) # not finished yet