
require("calabash").do "threejs demo",
  "pkill -f doodle"
  "cjsify -o build/build.js --inline-source-map -w coffee/main.coffee"
  "jade -o build/ -wP layout/index.jade"
  "stylus -o build/ -w layout/"
  "doodle build/"