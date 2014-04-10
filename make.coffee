
require 'shelljs/make'
fs = require 'fs'
{renderer} = require 'cirru-html'

browserify = require 'browserify'

station = undefined

reload = ->
  station?.reload 'repo/three'

target.cirru = ->
  file = 'cirru/index.cirru'
  render = renderer (cat file), '@filename': file
  render().to 'index.html'
  do reload

target.watch = ->

  station = require 'devtools-reloader-station'
  station.start()

  fs.watch 'cirru/', interval: 200, target.reload

  exec 'coffee -o js/ -wbc coffee/', async: yes

  fs.watch 'js/', interval: 200, target.browserify

target.browserify = ->
    b = browserify ['./js/main']
    build = fs.createWriteStream 'build/build.js', 'utf8'
    bundle = b.bundle(debug: yes)
    bundle.pipe build
    bundle.on 'end', reload