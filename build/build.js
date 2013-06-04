;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var camera, canvas, delay, geometry, height, line, material, paint_point, polyline, ratio, render, renderer, scene, test, width;

  console.log("loaded");

  width = 1300;

  height = 700;

  scene = new THREE.Scene;

  ratio = width / height;

  camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 800);

  camera.position.set(0, 0, 300);

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer;

  renderer.setSize(width, height);

  canvas = renderer.domElement;

  document.body.appendChild(canvas);

  canvas.setAttribute("width", "" + width + "px");

  canvas.setAttribute("height", "" + height + "px");

  geometry = new THREE.CubeGeometry;

  paint_point = function(a) {
    return geometry.vertices.push(new THREE.Vector3(a.x, a.y, a.z));
  };

  test = require("./test.coffee");

  polyline = test.test_line();

  polyline.forEach(paint_point);

  material = new THREE.LineBasicMaterial({
    color: 0x000022,
    linewidth: 2
  });

  line = new THREE.Line(geometry, material);

  scene.add(line);

  delay = function(t, f) {
    return setTimeout(f, t);
  };

  (render = function() {
    delay(100, function() {
      return requestAnimationFrame(render);
    });
    renderer.render(scene, camera);
    line.rotation.y += 0.02;
    return line.rotation.z += 0.003;
  })();

}).call(this);


},{"./test.coffee":2}],3:[function(require,module,exports){
(function() {
  exports.three = function(a) {
    return {
      x: a.x,
      y: a.y,
      z: a.z
    };
  };

  exports.four = function(a) {
    return {
      x: a.x,
      y: a.y,
      z: a.z,
      w: 6
    };
  };

}).call(this);


},{}],2:[function(require,module,exports){
(function() {
  var bend, data, fix, four, p1, p2, p3, p4, p5, p6, p7, three, _ref;

  _ref = require("./three_quarter.coffee"), three = _ref.three, four = _ref.four;

  bend = require("./bend.coffee").bend;

  p1 = {
    x: -150,
    y: 0,
    z: 0
  };

  p2 = {
    x: -10,
    y: 0,
    z: 0
  };

  p3 = {
    x: -50,
    y: 100,
    z: 40
  };

  p4 = {
    x: 0,
    y: 0,
    z: 0
  };

  p5 = {
    x: 50,
    y: 100,
    z: -40
  };

  p6 = {
    x: 10,
    y: 0,
    z: 0
  };

  p7 = {
    x: 150,
    y: 0,
    z: 0
  };

  data = [p1, p2, p3, p4, p5, p6, p7].map(four);

  fix = function(a) {
    return a.toFixed(1);
  };

  exports.test_line = function() {
    var result;
    result = data;
    [1, 2, 3, 4].forEach(function() {
      return result = bend(result, data);
    });
    return result;
  };

}).call(this);


},{"./three_quarter.coffee":3,"./bend.coffee":4}],4:[function(require,module,exports){
(function() {
  var bend, divide, each_grow, length2, minus, multiply, plus, _ref;

  _ref = require("./quaternion.coffee"), plus = _ref.plus, minus = _ref.minus, multiply = _ref.multiply, divide = _ref.divide, length2 = _ref.length2;

  each_grow = function(origin, destination, path) {
    var course, end, factor, polyline, start, whole_course;
    start = path[0];
    end = path[path.length - 1];
    course = minus(end, start);
    whole_course = minus(destination, origin);
    factor = divide(whole_course, course);
    polyline = [];
    path.slice(1, -1).forEach(function(a) {
      var b, c;
      b = minus(a, start);
      c = multiply(b, factor);
      return polyline.push(plus(origin, c));
    });
    polyline.push(destination);
    return polyline;
  };

  bend = function(list, template) {
    var base_point, result;
    base_point = list[0];
    result = [base_point];
    list.slice(1).forEach(function(guide_point) {
      var segment, _ref1;
      if ((1 < (_ref1 = length2(guide_point, base_point)) && _ref1 < 800000)) {
        segment = each_grow(base_point, guide_point, template);
        result.push.apply(result, segment);
        return base_point = guide_point;
      }
    });
    return result;
  };

  exports.bend = bend;

}).call(this);


},{"./quaternion.coffee":5}],5:[function(require,module,exports){
(function() {
  var conjugate, divide, length2, minus, multiply, norm, plus, square, sum4Square;

  plus = function(a, b) {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
      z: a.z + b.z,
      w: a.w + b.w
    };
  };

  minus = function(a, b) {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
      z: a.z - b.z,
      w: a.w - b.w
    };
  };

  multiply = function(a, b) {
    return {
      x: (a.x * b.x) - (a.y * b.y) - (a.z * b.z) - (a.w * b.w),
      y: (a.x * b.y) + (a.y * b.x) + (a.z * b.w) - (a.w * b.z),
      z: (a.x * b.z) + (a.z * b.x) + (a.w * b.y) - (a.y * b.w),
      w: (a.x * b.w) + (a.w * b.x) + (a.y * b.z) - (a.z * b.y)
    };
  };

  conjugate = function(a) {
    return {
      x: a.x,
      y: -a.y,
      z: -a.z,
      w: -a.w
    };
  };

  square = function(a) {
    return a * a;
  };

  sum4Square = function(a) {
    var s4;
    s4 = square;
    return (s4(a.x)) + (s4(a.y)) + (s4(a.z)) + (s4(a.w));
  };

  length2 = function(a) {
    return sum4Square(a);
  };

  norm = function(a) {
    return Math.pow(length2(a), 0.5);
  };

  divide = function(a, b) {
    var c, d, realPart;
    c = conjugate(b);
    d = multiply(a, c);
    realPart = sum4Square(b);
    if (realPart === 0) {
      return {
        x: 0,
        y: 0,
        z: 0,
        w: 0
      };
    } else {
      return {
        x: d.x / realPart,
        y: d.y / realPart,
        z: d.z / realPart,
        w: d.z / realPart
      };
    }
  };

  exports.plus = plus;

  exports.minus = minus;

  exports.multiply = multiply;

  exports.divide = divide;

  exports.norm = norm;

  exports.length2 = length2;

}).call(this);


},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvbWFpbi5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvdGhyZWVfcXVhcnRlci5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvdGVzdC5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvYmVuZC5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvcXVhdGVybmlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBO0NBQUEsS0FBQSxxSEFBQTs7Q0FBQSxDQUFBLENBQUEsSUFBTyxDQUFQOztDQUFBLENBRUEsQ0FBUSxDQUZSLENBRUE7O0NBRkEsQ0FHQSxDQUFTLEdBQVQ7O0FBRVEsQ0FMUixDQUtBLENBQVEsRUFBUjs7Q0FMQSxDQU1BLENBQVEsRUFBUixDQU5BOztDQUFBLENBT0EsQ0FBYSxDQUFBLENBQUssQ0FBbEIsV0FBYTs7Q0FQYixDQVFBLENBQUEsR0FBTSxFQUFTOztDQVJmLENBU0EsRUFBbUIsQ0FBSyxDQUFsQixDQUFhOztBQUVSLENBWFgsQ0FXQSxDQUFXLEVBQVMsR0FBcEIsS0FYQTs7Q0FBQSxDQVlBLEdBQUEsQ0FBQSxDQUFBLENBQVE7O0NBWlIsQ0FhQSxDQUFTLEdBQVQsRUFBaUIsRUFiakI7O0NBQUEsQ0FjQSxFQUFhLEVBQWIsRUFBUSxHQUFSOztDQWRBLENBZ0JBLENBQStCLENBQS9CLENBQTZCLENBQXZCLENBQU4sS0FBQTs7Q0FoQkEsQ0FpQkEsQ0FBZ0MsQ0FBaEMsRUFBTSxFQUFOLElBQUE7O0FBRVcsQ0FuQlgsQ0FtQkEsQ0FBVyxFQUFTLEdBQXBCLElBbkJBOztDQUFBLENBcUJBLENBQWMsTUFBQyxFQUFmO0NBQ1csQ0FBc0MsRUFBL0MsQ0FBaUMsRUFBTCxDQUFwQixHQUFSO0NBdEJGLEVBcUJjOztDQXJCZCxDQXdCQSxDQUFPLENBQVAsR0FB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UDs7Q0FuREEsQ0FvREEsQ0FBaUIsR0FBakIsQ0FBTzs7Q0FwRFAsQ0FxREEsQ0FBZSxDQUFmLEdBQU87O0NBckRQLENBc0RBLENBQWtCLElBQVg7Q0F0RFAiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgc29tdGluZ1xuY29uc29sZS5sb2cgXCJsb2FkZWRcIlxuXG53aWR0aCA9IDEzMDBcbmhlaWdodCA9IDcwMFxuXG5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZVxucmF0aW8gPSB3aWR0aCAvIGhlaWdodFxuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIDQ1LCByYXRpbywgMC4xLCA4MDBcbmNhbWVyYS5wb3NpdGlvbi5zZXQgMCwgMCwgMzAwXG5jYW1lcmEubG9va0F0IChuZXcgVEhSRUUuVmVjdG9yMyAwLCAwLCAwKVxuXG5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyXG5yZW5kZXJlci5zZXRTaXplIHdpZHRoLCBoZWlnaHRcbmNhbnZhcyA9IHJlbmRlcmVyLmRvbUVsZW1lbnRcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQgY2FudmFzXG5cbmNhbnZhcy5zZXRBdHRyaWJ1dGUgXCJ3aWR0aFwiLCBcIiN7d2lkdGh9cHhcIlxuY2FudmFzLnNldEF0dHJpYnV0ZSBcImhlaWdodFwiLCBcIiN7aGVpZ2h0fXB4XCJcblxuZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3ViZUdlb21ldHJ5XG5cbnBhaW50X3BvaW50ID0gKGEpIC0+XG4gIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2ggKG5ldyBUSFJFRS5WZWN0b3IzIGEueCwgYS55LCBhLnopXG5cbnRlc3QgPSByZXF1aXJlIFwiLi90ZXN0LmNvZmZlZVwiXG5wb2x5bGluZSA9IHRlc3QudGVzdF9saW5lKClcbnBvbHlsaW5lLmZvckVhY2ggcGFpbnRfcG9pbnRcblxubWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwgY29sb3I6IDB4MDAwMDIyLCBsaW5ld2lkdGg6IDJcbmxpbmUgPSBuZXcgVEhSRUUuTGluZSBnZW9tZXRyeSwgbWF0ZXJpYWxcbnNjZW5lLmFkZCBsaW5lXG5cbmRlbGF5ID0gKHQsIGYpIC0+IHNldFRpbWVvdXQgZiwgdFxuXG5kbyByZW5kZXIgPSAtPlxuICBkZWxheSAxMDAsIC0+XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHJlbmRlclxuICByZW5kZXJlci5yZW5kZXIgc2NlbmUsIGNhbWVyYVxuICBsaW5lLnJvdGF0aW9uLnkgKz0gMC4wMlxuICBsaW5lLnJvdGF0aW9uLnogKz0gMC4wMDMiLCJcbmV4cG9ydHMudGhyZWUgPSAoYSkgLT5cbiAgeDogYS54XG4gIHk6IGEueVxuICB6OiBhLnpcblxuZXhwb3J0cy5mb3VyID0gKGEpIC0+XG4gIHg6IGEueFxuICB5OiBhLnlcbiAgejogYS56XG4gIHc6IDYiLCJcbnt0aHJlZSwgZm91cn0gPSByZXF1aXJlIFwiLi90aHJlZV9xdWFydGVyLmNvZmZlZVwiXG5cbntiZW5kfSA9IHJlcXVpcmUgXCIuL2JlbmQuY29mZmVlXCJcblxucDEgPSB4OiAtMTUwLCB5OiAwLCB6OiAwXG5wMiA9IHg6IC0xMCwgeTogMCwgejogMFxucDMgPSB4OiAtNTAsIHk6IDEwMCwgejogNDBcbnA0ID0geDogMCwgeTogMCwgejogMFxucDUgPSB4OiA1MCwgeTogMTAwLCB6OiAtNDBcbnA2ID0geDogMTAsIHk6IDAsIHo6IDBcbnA3ID0geDogMTUwLCB5OiAwLCB6OiAwXG5cbmRhdGEgPSBbcDEsIHAyLCBwMywgcDQsIHA1LCBwNiwgcDddLm1hcCBmb3VyXG5maXggPSAoYSkgLT4gYS50b0ZpeGVkIDFcblxuZXhwb3J0cy50ZXN0X2xpbmUgPSAtPlxuICByZXN1bHQgPSBkYXRhXG4gIFsxLi40XS5mb3JFYWNoIC0+XG4gICAgcmVzdWx0ID0gYmVuZCByZXN1bHQsIGRhdGFcblxuICAjIHJlcXVpcmUoJy4vZm9ybWF0LmNvZmZlZScpLmxpc3QgcmVzdWx0IFxuICByZXN1bHQiLCJcbntwbHVzLCBtaW51cywgbXVsdGlwbHksIGRpdmlkZSwgbGVuZ3RoMn0gPSByZXF1aXJlIFwiLi9xdWF0ZXJuaW9uLmNvZmZlZVwiXG5cbmVhY2hfZ3JvdyA9IChvcmlnaW4sIGRlc3RpbmF0aW9uLCBwYXRoKSAtPlxuICBzdGFydCA9IHBhdGhbMF1cbiAgZW5kID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdXG4gIGNvdXJzZSA9IG1pbnVzIGVuZCwgc3RhcnRcbiAgd2hvbGVfY291cnNlID0gbWludXMgZGVzdGluYXRpb24sIG9yaWdpblxuXG4gIGZhY3RvciA9IGRpdmlkZSB3aG9sZV9jb3Vyc2UsIGNvdXJzZVxuICBwb2x5bGluZSA9IFtdXG5cbiAgcGF0aFsxLi4uLTFdLmZvckVhY2ggKGEpIC0+XG4gICAgYiA9IG1pbnVzIGEsIHN0YXJ0XG4gICAgYyA9IG11bHRpcGx5IGIsIGZhY3RvclxuICAgIHBvbHlsaW5lLnB1c2ggKHBsdXMgb3JpZ2luLCBjKVxuXG4gIHBvbHlsaW5lLnB1c2ggZGVzdGluYXRpb25cbiAgIyBjb25zb2xlLmxvZyBcInBvbHlsaW5lXCIsIHBvbHlsaW5lXG4gIHBvbHlsaW5lXG5cbmJlbmQgPSAobGlzdCwgdGVtcGxhdGUpIC0+XG4gIGJhc2VfcG9pbnQgPSBsaXN0WzBdXG4gIHJlc3VsdCA9IFtiYXNlX3BvaW50XVxuXG4gIGxpc3RbMS4uXS5mb3JFYWNoIChndWlkZV9wb2ludCkgLT5cbiAgICBpZiAxIDwgKGxlbmd0aDIgZ3VpZGVfcG9pbnQsIGJhc2VfcG9pbnQpIDwgODAwMDAwXG4gICAgICBzZWdtZW50ID0gZWFjaF9ncm93IGJhc2VfcG9pbnQsIGd1aWRlX3BvaW50LCB0ZW1wbGF0ZVxuICAgICAgcmVzdWx0LnB1c2ggc2VnbWVudC4uLlxuICAgICAgYmFzZV9wb2ludCA9IGd1aWRlX3BvaW50XG5cbiAgcmVzdWx0XG5cbmV4cG9ydHMuYmVuZCA9IGJlbmQiLCJcbnBsdXMgPSAoYSwgYikgLT5cbiAgeDogYS54ICsgYi54XG4gIHk6IGEueSArIGIueVxuICB6OiBhLnogKyBiLnpcbiAgdzogYS53ICsgYi53XG5cbm1pbnVzID0gKGEsIGIpIC0+XG4gIHg6IGEueCAtIGIueFxuICB5OiBhLnkgLSBiLnlcbiAgejogYS56IC0gYi56XG4gIHc6IGEudyAtIGIud1xuXG4jIHkgKiB6ID09IHdcbiMgeiAqIHcgPT4geiAqIHkgKiB6ID0+IC0geiAqIHogKiB5ID0+IHlcbiMgdyAqIHkgPT4geSAqIHogKiB5ID0+IHpcbiMgeSAqIHogKiB3ID0+IHcgKiB3ID0+IC0xXG5tdWx0aXBseSA9IChhLCBiKSAtPlxuICB4OiAoYS54ICogYi54KSAtIChhLnkgKiBiLnkpIC0gKGEueiAqIGIueikgLSAoYS53ICogYi53KVxuICB5OiAoYS54ICogYi55KSArIChhLnkgKiBiLngpICsgKGEueiAqIGIudykgLSAoYS53ICogYi56KVxuICB6OiAoYS54ICogYi56KSArIChhLnogKiBiLngpICsgKGEudyAqIGIueSkgLSAoYS55ICogYi53KVxuICB3OiAoYS54ICogYi53KSArIChhLncgKiBiLngpICsgKGEueSAqIGIueikgLSAoYS56ICogYi55KVxuXG5jb25qdWdhdGUgPSAoYSkgLT5cbiAgeDogYS54XG4gIHk6IC0gYS55XG4gIHo6IC0gYS56XG4gIHc6IC0gYS53XG5cbnNxdWFyZSA9IChhKSAtPiBhICogYVxuc3VtNFNxdWFyZSA9IChhKSAtPlxuICBzNCA9IHNxdWFyZVxuICAoczQgYS54KSArIChzNCBhLnkpICsgKHM0IGEueikgKyAoczQgYS53KVxuXG5sZW5ndGgyID0gKGEpIC0+IHN1bTRTcXVhcmUgYVxuXG5ub3JtID0gKGEpIC0+IE1hdGgucG93IChsZW5ndGgyIGEpLCAwLjVcblxuZGl2aWRlID0gKGEsIGIpIC0+XG4gIGMgPSBjb25qdWdhdGUgYlxuICBkID0gbXVsdGlwbHkgYSwgY1xuICByZWFsUGFydCA9IHN1bTRTcXVhcmUgYlxuICBpZiByZWFsUGFydCBpcyAwXG4gICAgeDogMCwgeTogMCwgejogMCwgdzogMFxuICBlbHNlXG4gICAgeDogZC54IC8gcmVhbFBhcnRcbiAgICB5OiBkLnkgLyByZWFsUGFydFxuICAgIHo6IGQueiAvIHJlYWxQYXJ0XG4gICAgdzogZC56IC8gcmVhbFBhcnRcblxuZXhwb3J0cy5wbHVzID0gcGx1c1xuZXhwb3J0cy5taW51cyA9IG1pbnVzXG5leHBvcnRzLm11bHRpcGx5ID0gbXVsdGlwbHlcbmV4cG9ydHMuZGl2aWRlID0gZGl2aWRlXG5leHBvcnRzLm5vcm0gPSBub3JtXG5leHBvcnRzLmxlbmd0aDIgPSBsZW5ndGgyIl19
;