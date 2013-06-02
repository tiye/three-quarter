
{plus, minus, multiply, divide, length2} = require "./quaternion.coffee"

each_grow = (origin, destination, path) ->
  start = path[0]
  end = path[path.length - 1]
  course = minus end, start
  whole_course = minus destination, origin

  factor = divide whole_course, course
  polyline = []

  path[1...-1].forEach (a) ->
    b = minus a, start
    c = multiply b, factor
    polyline.push (plus origin, c)

  polyline.push destination
  # console.log "polyline", polyline
  polyline

bend = (list, template) ->
  base_point = list[0]
  result = [base_point]

  list[1..].forEach (guide_point) ->
    if 1 < (length2 guide_point, base_point) < 800000
      segment = each_grow base_point, guide_point, template
      result.push segment...
      base_point = guide_point

  result

exports.bend = bend