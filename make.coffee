
project = 'repo/three-quarter'
station = undefined
interval = interval: 300

require 'shelljs/make'
fs = require 'fs'
browserify = require 'browserify'
{renderer} = require 'cirru-html'

reload = -> station?.reload project

target.cirru = ->
  file = 'cirru/index.cirru'
  render = renderer (cat file), '@filename': file
  html = render()
  fs.writeFile 'index.html', html, 'utf8', (err) ->
    console.log 'done: cirru'
    do reload

target.browserify = ->
  b = browserify ['./js/main']
  build = fs.createWriteStream 'build/build.js', 'utf8'
  bundle = b.bundle(debug: yes)
  bundle.pipe build
  bundle.on 'end', ->
    console.log 'done: browserify'
    do reload

target.js = ->
  exec 'coffee -o js/ -bc coffee/'

target.coffee = (name, callback) ->
  exec "coffee -o js/ -bc #{name}", ->
    console.log "done: coffee, compiled coffee/#{name}"
    callback?()

target.compile = ->
  target.cirru()
  target.browserify()

target.watch = ->
  fs.watch 'cirru/', interval, target.cirru
  fs.watch 'coffee/', interval, (type, name) ->
    if type is 'change'
      target.coffee name, target.browserify

  station = require 'devtools-reloader-station'
  station.start()
  console.log 'start watching'