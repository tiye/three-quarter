
fix = (x) -> x.toFixed 1

four = (q) ->
  "#{fix q.x}\t#{fix q.y}\t#{fix q.z}\t#{fix q.w}"

exports.list = (list) ->
  console.log list.map(four).join('\n')