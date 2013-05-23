
require("calabash").do "threejs demo",
  "pkill -f doodle"
  "cjsify -o build/build.js -w coffee/main.coffee -s build/build.map"
  "jade -o build/ -wP layout/index.jade"
  "stylus -o build/ -w layout/"
  "doodle build/"