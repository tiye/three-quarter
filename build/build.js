;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
(function() {
  var camera, canvas, delay, geometry, height, line, material, paint_point, polyline, ratio, render, renderer, scene, test, width;

  console.log("loaded");

  width = 1300;

  height = 700;

  scene = new THREE.Scene;

  ratio = width / height;

  camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 800);

  camera.position.set(0, 0, 400);

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer;

  renderer.setSize(width, height);

  canvas = renderer.domElement;

  document.body.appendChild(canvas);

  canvas.setAttribute("width", "" + width + "px");

  canvas.setAttribute("height", "" + height + "px");

  geometry = new THREE.Geometry;

  paint_point = function(a) {
    return geometry.vertices.push(new THREE.Vector3(a.x, a.y, a.z));
  };

  test = require("./test.coffee");

  polyline = test.test_line();

  polyline.forEach(paint_point);

  material = new THREE.LineBasicMaterial({
    color: 0x000022,
    linewidth: 4
  });

  line = new THREE.Line(geometry, material);

  scene.add(line);

  delay = function(t, f) {
    return setTimeout(f, t);
  };

  (render = function() {
    delay(10, function() {
      return requestAnimationFrame(render);
    });
    renderer.render(scene, camera);
    return line.rotation.y += 0.007;
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
    x: -200,
    y: 0,
    z: 0
  };

  p2 = {
    x: 0,
    y: 0,
    z: 0
  };

  p3 = {
    x: 0,
    y: 114,
    z: -114
  };

  p4 = {
    x: 0,
    y: 0,
    z: 0
  };

  p5 = {
    x: 0,
    y: 114,
    z: 114
  };

  p6 = {
    x: 0,
    y: 0,
    z: 0
  };

  p7 = {
    x: 200,
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
    [1, 2, 3, 4, 5].forEach(function() {
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvbWFpbi5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvdGhyZWVfcXVhcnRlci5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvdGVzdC5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvYmVuZC5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvcXVhdGVybmlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBO0NBQUEsS0FBQSxxSEFBQTs7Q0FBQSxDQUFBLENBQUEsSUFBTyxDQUFQOztDQUFBLENBRUEsQ0FBUSxDQUZSLENBRUE7O0NBRkEsQ0FHQSxDQUFTLEdBQVQ7O0FBRVEsQ0FMUixDQUtBLENBQVEsRUFBUjs7Q0FMQSxDQU1BLENBQVEsRUFBUixDQU5BOztDQUFBLENBT0EsQ0FBYSxDQUFBLENBQUssQ0FBbEIsV0FBYTs7Q0FQYixDQVFBLENBQUEsR0FBTSxFQUFTOztDQVJmLENBU0EsRUFBbUIsQ0FBSyxDQUFsQixDQUFhOztBQUVSLENBWFgsQ0FXQSxDQUFXLEVBQVMsR0FBcEIsS0FYQTs7Q0FBQSxDQVlBLEdBQUEsQ0FBQSxDQUFBLENBQVE7O0NBWlIsQ0FhQSxDQUFTLEdBQVQsRUFBaUIsRUFiakI7O0NBQUEsQ0FjQSxFQUFhLEVBQWIsRUFBUSxHQUFSOztDQWRBLENBZ0JBLENBQStCLENBQS9CLENBQTZCLENBQXZCLENBQU4sS0FBQTs7Q0FoQkEsQ0FpQkEsQ0FBZ0MsQ0FBaEMsRUFBTSxFQUFOLElBQUE7O0FBRVcsQ0FuQlgsQ0FtQkEsQ0FBVyxFQUFTLEdBQXBCOztDQW5CQSxDQXFCQSxDQUFjLE1BQUMsRUFBZjtDQUNXLENBQXNDLEVBQS9DLENBQWlDLEVBQUwsQ0FBcEIsR0FBUjtDQXRCRixFQXFCYzs7Q0FyQmQsQ0F3QkEsQ0FBTyxDQUFQLEdBQU8sUUFB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aUIsR0FBakIsQ0FBTzs7Q0FwRFAsQ0FxREEsQ0FBZSxDQUFmLEdBQU87O0NBckRQLENBc0RBLENBQWtCLElBQVg7Q0F0RFAiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMgc29tdGluZ1xuY29uc29sZS5sb2cgXCJsb2FkZWRcIlxuXG53aWR0aCA9IDEzMDBcbmhlaWdodCA9IDcwMFxuXG5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZVxucmF0aW8gPSB3aWR0aCAvIGhlaWdodFxuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIDQ1LCByYXRpbywgMC4xLCA4MDBcbmNhbWVyYS5wb3NpdGlvbi5zZXQgMCwgMCwgNDAwXG5jYW1lcmEubG9va0F0IChuZXcgVEhSRUUuVmVjdG9yMyAwLCAwLCAwKVxuXG5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyXG5yZW5kZXJlci5zZXRTaXplIHdpZHRoLCBoZWlnaHRcbmNhbnZhcyA9IHJlbmRlcmVyLmRvbUVsZW1lbnRcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQgY2FudmFzXG5cbmNhbnZhcy5zZXRBdHRyaWJ1dGUgXCJ3aWR0aFwiLCBcIiN7d2lkdGh9cHhcIlxuY2FudmFzLnNldEF0dHJpYnV0ZSBcImhlaWdodFwiLCBcIiN7aGVpZ2h0fXB4XCJcblxuZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnlcblxucGFpbnRfcG9pbnQgPSAoYSkgLT5cbiAgZ2VvbWV0cnkudmVydGljZXMucHVzaCAobmV3IFRIUkVFLlZlY3RvcjMgYS54LCBhLnksIGEueilcblxudGVzdCA9IHJlcXVpcmUgXCIuL3Rlc3QuY29mZmVlXCJcbnBvbHlsaW5lID0gdGVzdC50ZXN0X2xpbmUoKVxucG9seWxpbmUuZm9yRWFjaCBwYWludF9wb2ludFxuXG5tYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCBjb2xvcjogMHgwMDAwMjIsIGxpbmV3aWR0aDogNFxubGluZSA9IG5ldyBUSFJFRS5MaW5lIGdlb21ldHJ5LCBtYXRlcmlhbFxuc2NlbmUuYWRkIGxpbmVcblxuZGVsYXkgPSAodCwgZikgLT4gc2V0VGltZW91dCBmLCB0XG5cbmRvIHJlbmRlciA9IC0+XG4gIGRlbGF5IDEwLCAtPlxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSByZW5kZXJcbiAgcmVuZGVyZXIucmVuZGVyIHNjZW5lLCBjYW1lcmFcbiAgbGluZS5yb3RhdGlvbi55ICs9IDAuMDA3XG4gICMgbGluZS5yb3RhdGlvbi56ICs9IDAuMDAxIiwiXG5leHBvcnRzLnRocmVlID0gKGEpIC0+XG4gIHg6IGEueFxuICB5OiBhLnlcbiAgejogYS56XG5cbmV4cG9ydHMuZm91ciA9IChhKSAtPlxuICB4OiBhLnhcbiAgeTogYS55XG4gIHo6IGEuelxuICB3OiA2IiwiXG57dGhyZWUsIGZvdXJ9ID0gcmVxdWlyZSBcIi4vdGhyZWVfcXVhcnRlci5jb2ZmZWVcIlxuXG57YmVuZH0gPSByZXF1aXJlIFwiLi9iZW5kLmNvZmZlZVwiXG5cbnAxID0geDogLTIwMCwgeTogMCwgejogMFxucDIgPSB4OiAwLCB5OiAwLCB6OiAwXG5wMyA9IHg6IDAsIHk6IDExNCwgejogLTExNFxucDQgPSB4OiAwLCB5OiAwLCB6OiAwXG5wNSA9IHg6IDAsIHk6IDExNCwgejogMTE0XG5wNiA9IHg6IDAsIHk6IDAsIHo6IDBcbnA3ID0geDogMjAwLCB5OiAwLCB6OiAwXG5cbmRhdGEgPSBbcDEsIHAyLCBwMywgcDQsIHA1LCBwNiwgcDddLm1hcCBmb3VyXG5maXggPSAoYSkgLT4gYS50b0ZpeGVkIDFcblxuZXhwb3J0cy50ZXN0X2xpbmUgPSAtPlxuICByZXN1bHQgPSBkYXRhXG4gIFsxLi41XS5mb3JFYWNoIC0+IHJlc3VsdCA9IGJlbmQgcmVzdWx0LCBkYXRhXG5cbiAgIyByZXF1aXJlKCcuL2Zvcm1hdC5jb2ZmZWUnKS5saXN0IHJlc3VsdCBcbiAgcmVzdWx0IiwiXG57cGx1cywgbWludXMsIG11bHRpcGx5LCBkaXZpZGUsIGxlbmd0aDJ9ID0gcmVxdWlyZSBcIi4vcXVhdGVybmlvbi5jb2ZmZWVcIlxuXG5lYWNoX2dyb3cgPSAob3JpZ2luLCBkZXN0aW5hdGlvbiwgcGF0aCkgLT5cbiAgc3RhcnQgPSBwYXRoWzBdXG4gIGVuZCA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXVxuICBjb3Vyc2UgPSBtaW51cyBlbmQsIHN0YXJ0XG4gIHdob2xlX2NvdXJzZSA9IG1pbnVzIGRlc3RpbmF0aW9uLCBvcmlnaW5cblxuICBmYWN0b3IgPSBkaXZpZGUgd2hvbGVfY291cnNlLCBjb3Vyc2VcbiAgcG9seWxpbmUgPSBbXVxuXG4gIHBhdGhbMS4uLi0xXS5mb3JFYWNoIChhKSAtPlxuICAgIGIgPSBtaW51cyBhLCBzdGFydFxuICAgIGMgPSBtdWx0aXBseSBiLCBmYWN0b3JcbiAgICBwb2x5bGluZS5wdXNoIChwbHVzIG9yaWdpbiwgYylcblxuICBwb2x5bGluZS5wdXNoIGRlc3RpbmF0aW9uXG4gICMgY29uc29sZS5sb2cgXCJwb2x5bGluZVwiLCBwb2x5bGluZVxuICBwb2x5bGluZVxuXG5iZW5kID0gKGxpc3QsIHRlbXBsYXRlKSAtPlxuICBiYXNlX3BvaW50ID0gbGlzdFswXVxuICByZXN1bHQgPSBbYmFzZV9wb2ludF1cblxuICBsaXN0WzEuLl0uZm9yRWFjaCAoZ3VpZGVfcG9pbnQpIC0+XG4gICAgaWYgMSA8IChsZW5ndGgyIGd1aWRlX3BvaW50LCBiYXNlX3BvaW50KSA8IDgwMDAwMFxuICAgICAgc2VnbWVudCA9IGVhY2hfZ3JvdyBiYXNlX3BvaW50LCBndWlkZV9wb2ludCwgdGVtcGxhdGVcbiAgICAgIHJlc3VsdC5wdXNoIHNlZ21lbnQuLi5cbiAgICAgIGJhc2VfcG9pbnQgPSBndWlkZV9wb2ludFxuXG4gIHJlc3VsdFxuXG5leHBvcnRzLmJlbmQgPSBiZW5kIiwiXG5wbHVzID0gKGEsIGIpIC0+XG4gIHg6IGEueCArIGIueFxuICB5OiBhLnkgKyBiLnlcbiAgejogYS56ICsgYi56XG4gIHc6IGEudyArIGIud1xuXG5taW51cyA9IChhLCBiKSAtPlxuICB4OiBhLnggLSBiLnhcbiAgeTogYS55IC0gYi55XG4gIHo6IGEueiAtIGIuelxuICB3OiBhLncgLSBiLndcblxuIyB5ICogeiA9PSB3XG4jIHogKiB3ID0+IHogKiB5ICogeiA9PiAtIHogKiB6ICogeSA9PiB5XG4jIHcgKiB5ID0+IHkgKiB6ICogeSA9PiB6XG4jIHkgKiB6ICogdyA9PiB3ICogdyA9PiAtMVxubXVsdGlwbHkgPSAoYSwgYikgLT5cbiAgeDogKGEueCAqIGIueCkgLSAoYS55ICogYi55KSAtIChhLnogKiBiLnopIC0gKGEudyAqIGIudylcbiAgeTogKGEueCAqIGIueSkgKyAoYS55ICogYi54KSArIChhLnogKiBiLncpIC0gKGEudyAqIGIueilcbiAgejogKGEueCAqIGIueikgKyAoYS56ICogYi54KSArIChhLncgKiBiLnkpIC0gKGEueSAqIGIudylcbiAgdzogKGEueCAqIGIudykgKyAoYS53ICogYi54KSArIChhLnkgKiBiLnopIC0gKGEueiAqIGIueSlcblxuY29uanVnYXRlID0gKGEpIC0+XG4gIHg6IGEueFxuICB5OiAtIGEueVxuICB6OiAtIGEuelxuICB3OiAtIGEud1xuXG5zcXVhcmUgPSAoYSkgLT4gYSAqIGFcbnN1bTRTcXVhcmUgPSAoYSkgLT5cbiAgczQgPSBzcXVhcmVcbiAgKHM0IGEueCkgKyAoczQgYS55KSArIChzNCBhLnopICsgKHM0IGEudylcblxubGVuZ3RoMiA9IChhKSAtPiBzdW00U3F1YXJlIGFcblxubm9ybSA9IChhKSAtPiBNYXRoLnBvdyAobGVuZ3RoMiBhKSwgMC41XG5cbmRpdmlkZSA9IChhLCBiKSAtPlxuICBjID0gY29uanVnYXRlIGJcbiAgZCA9IG11bHRpcGx5IGEsIGNcbiAgcmVhbFBhcnQgPSBzdW00U3F1YXJlIGJcbiAgaWYgcmVhbFBhcnQgaXMgMFxuICAgIHg6IDAsIHk6IDAsIHo6IDAsIHc6IDBcbiAgZWxzZVxuICAgIHg6IGQueCAvIHJlYWxQYXJ0XG4gICAgeTogZC55IC8gcmVhbFBhcnRcbiAgICB6OiBkLnogLyByZWFsUGFydFxuICAgIHc6IGQueiAvIHJlYWxQYXJ0XG5cbmV4cG9ydHMucGx1cyA9IHBsdXNcbmV4cG9ydHMubWludXMgPSBtaW51c1xuZXhwb3J0cy5tdWx0aXBseSA9IG11bHRpcGx5XG5leHBvcnRzLmRpdmlkZSA9IGRpdmlkZVxuZXhwb3J0cy5ub3JtID0gbm9ybVxuZXhwb3J0cy5sZW5ndGgyID0gbGVuZ3RoMiJdfQ==
;