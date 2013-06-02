
require("calabash").do "threejs demo",
  "pkill -f doodle"
  "watchify -o build/build.js -dt coffeeify coffee/main.coffee -v"
  "jade -o build/ -wP layout/index.jade"
  "stylus -o build/ -w layout/"
  "doodle build/"