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

  geometry = new THREE.CubeGeometry;

  paint_point = function(a) {
    return geometry.vertices.push(new THREE.Vector3(a.x, a.y, a.z));
  };

  test = require("./test.coffee");

  polyline = test.test_line();

  polyline.forEach(paint_point);

  material = new THREE.LineBasicMaterial({
    color: 0xccccff,
    linewidth: 1
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


},{"./test.coffee":2}],2:[function(require,module,exports){
(function() {
  var bend, data, fix, four, p1, p2, p3, p4, p5, three, _ref;

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
    z: 20
  };

  p3 = {
    x: 0,
    y: 120,
    z: 0
  };

  p4 = {
    x: 10,
    y: 0,
    z: -20
  };

  p5 = {
    x: 150,
    y: 0,
    z: 0
  };

  data = [p1, p2, p3, p4, p5].map(four);

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


},{"./three_quarter.coffee":3,"./bend.coffee":4}],3:[function(require,module,exports){
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


},{}],4:[function(require,module,exports){
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvbWFpbi5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvdGVzdC5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvdGhyZWVfcXVhcnRlci5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvYmVuZC5jb2ZmZWUiLCIvb3B0L3MvdGhyZWUtcXVhcnRlci9jb2ZmZWUvcXVhdGVybmlvbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBO0NBQUEsS0FBQSxxSEFBQTs7Q0FBQSxDQUFBLENBQUEsSUFBTyxDQUFQOztDQUFBLENBRUEsQ0FBUSxDQUZSLENBRUE7O0NBRkEsQ0FHQSxDQUFTLEdBQVQ7O0FBRVEsQ0FMUixDQUtBLENBQVEsRUFBUjs7Q0FMQSxDQU1BLENBQVEsRUFBUixDQU5BOztDQUFBLENBT0EsQ0FBYSxDQUFBLENBQUssQ0FBbEIsV0FBYTs7Q0FQYixDQVFBLENBQUEsR0FBTSxFQUFTOztDQVJmLENBU0EsRUFBbUIsQ0FBSyxDQUFsQixDQUFhOztBQUVSLENBWFgsQ0FXQSxDQUFXLEVBQVMsR0FBcEIsS0FYQTs7Q0FBQSxDQVlBLEdBQUEsQ0FBQSxDQUFBLENBQVE7O0NBWlIsQ0FhQSxDQUFTLEdBQVQsRUFBaUIsRUFiakI7O0NBQUEsQ0FjQSxFQUFhLEVBQWIsRUFBUSxHQUFSOztDQWRBLENBZ0JBLENBQStCLENBQS9CLENBQTZCLENBQXZCLENBQU4sS0FBQTs7Q0FoQkEsQ0FpQkEsQ0FBZ0MsQ0FBaEMsRUFBTSxFQUFOLElBQUE7O0FBRVcsQ0FuQlgsQ0FtQkEsQ0FBVyxFQUFTLEdBQXBCLElBbkJBOztDQUFBLENBcUJBLENBQWMsTUFBQyxFQUFmO0NBQ1csQ0FBc0MsRUFBL0MsQ0FBaUMsRUFBTCxDQUFwQixHQUFSO0NBdEJGLEVBcUJjOztDQXJCZCxDQXdCQSxDQUFPLENBQVAsR0FB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PSAxMzAwXG5oZWlnaHQgPSA3MDBcblxuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmVcbnJhdGlvID0gd2lkdGggLyBoZWlnaHRcbmNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSA0NSwgcmF0aW8sIDAuMSwgODAwXG5jYW1lcmEucG9zaXRpb24uc2V0IDAsIDAsIDQwMFxuY2FtZXJhLmxvb2tBdCAobmV3IFRIUkVFLlZlY3RvcjMgMCwgMCwgMClcblxucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlclxucmVuZGVyZXIuc2V0U2l6ZSB3aWR0aCwgaGVpZ2h0XG5jYW52YXMgPSByZW5kZXJlci5kb21FbGVtZW50XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIGNhbnZhc1xuXG5jYW52YXMuc2V0QXR0cmlidXRlIFwid2lkdGhcIiwgXCIje3dpZHRofXB4XCJcbmNhbnZhcy5zZXRBdHRyaWJ1dGUgXCJoZWlnaHRcIiwgXCIje2hlaWdodH1weFwiXG5cbmdlb21ldHJ5ID0gbmV3IFRIUkVFLkN1YmVHZW9tZXRyeVxuXG5wYWludF9wb2ludCA9IChhKSAtPlxuICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoIChuZXcgVEhSRUUuVmVjdG9yMyBhLngsIGEueSwgYS56KVxuXG50ZXN0ID0gcmVxdWlyZSBcIi4vdGVzdC5jb2ZmZWVcIlxucG9seWxpbmUgPSB0ZXN0LnRlc3RfbGluZSgpXG5wb2x5bGluZS5mb3JFYWNoIHBhaW50X3BvaW50XG5cbm1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsIGNvbG9yOiAweGNjY2NmZiwgbGluZXdpZHRoOiAxXG5saW5lID0gbmV3IFRIUkVFLkxpbmUgZ2VvbWV0cnksIG1hdGVyaWFsXG5zY2VuZS5hZGQgbGluZVxuXG5kZWxheSA9ICh0LCBmKSAtPiBzZXRUaW1lb3V0IGYsIHRcblxuZG8gcmVuZGVyID0gLT5cbiAgZGVsYXkgMTAwLCAtPlxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSByZW5kZXJcbiAgcmVuZGVyZXIucmVuZGVyIHNjZW5lLCBjYW1lcmFcbiAgbGluZS5yb3RhdGlvbi55ICs9IDAuMDJcbiAgbGluZS5yb3RhdGlvbi56ICs9IDAuMDAzIiwiXG57dGhyZWUsIGZvdXJ9ID0gcmVxdWlyZSBcIi4vdGhyZWVfcXVhcnRlci5jb2ZmZWVcIlxuXG57YmVuZH0gPSByZXF1aXJlIFwiLi9iZW5kLmNvZmZlZVwiXG5cbnAxID0geDogLTE1MCwgeTogMCwgejogMFxucDIgPSB4OiAtMTAsIHk6IDAsIHo6IDIwXG5wMyA9IHg6IDAsIHk6IDEyMCwgejogMFxucDQgPSB4OiAxMCwgeTogMCwgejogLTIwXG5wNSA9IHg6IDE1MCwgeTogMCwgejogMFxuXG5kYXRhID0gW3AxLCBwMiwgcDMsIHA0LCBwNV0ubWFwIGZvdXJcbmZpeCA9IChhKSAtPiBhLnRvRml4ZWQgMVxuXG5leHBvcnRzLnRlc3RfbGluZSA9IC0+XG4gIHJlc3VsdCA9IGRhdGFcbiAgWzEuLjRdLmZvckVhY2ggLT5cbiAgICByZXN1bHQgPSBiZW5kIHJlc3VsdCwgZGF0YVxuXG4gICMgcmVxdWlyZSgnLi9mb3JtYXQuY29mZmVlJykubGlzdCByZXN1bHQgXG4gIHJlc3VsdCIsIlxuZXhwb3J0cy50aHJlZSA9IChhKSAtPlxuICB4OiBhLnhcbiAgeTogYS55XG4gIHo6IGEuelxuXG5leHBvcnRzLmZvdXIgPSAoYSkgLT5cbiAgeDogYS54XG4gIHk6IGEueVxuICB6OiBhLnpcbiAgdzogNiIsIlxue3BsdXMsIG1pbnVzLCBtdWx0aXBseSwgZGl2aWRlLCBsZW5ndGgyfSA9IHJlcXVpcmUgXCIuL3F1YXRlcm5pb24uY29mZmVlXCJcblxuZWFjaF9ncm93ID0gKG9yaWdpbiwgZGVzdGluYXRpb24sIHBhdGgpIC0+XG4gIHN0YXJ0ID0gcGF0aFswXVxuICBlbmQgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV1cbiAgY291cnNlID0gbWludXMgZW5kLCBzdGFydFxuICB3aG9sZV9jb3Vyc2UgPSBtaW51cyBkZXN0aW5hdGlvbiwgb3JpZ2luXG5cbiAgZmFjdG9yID0gZGl2aWRlIHdob2xlX2NvdXJzZSwgY291cnNlXG4gIHBvbHlsaW5lID0gW11cblxuICBwYXRoWzEuLi4tMV0uZm9yRWFjaCAoYSkgLT5cbiAgICBiID0gbWludXMgYSwgc3RhcnRcbiAgICBjID0gbXVsdGlwbHkgYiwgZmFjdG9yXG4gICAgcG9seWxpbmUucHVzaCAocGx1cyBvcmlnaW4sIGMpXG5cbiAgcG9seWxpbmUucHVzaCBkZXN0aW5hdGlvblxuICAjIGNvbnNvbGUubG9nIFwicG9seWxpbmVcIiwgcG9seWxpbmVcbiAgcG9seWxpbmVcblxuYmVuZCA9IChsaXN0LCB0ZW1wbGF0ZSkgLT5cbiAgYmFzZV9wb2ludCA9IGxpc3RbMF1cbiAgcmVzdWx0ID0gW2Jhc2VfcG9pbnRdXG5cbiAgbGlzdFsxLi5dLmZvckVhY2ggKGd1aWRlX3BvaW50KSAtPlxuICAgIGlmIDEgPCAobGVuZ3RoMiBndWlkZV9wb2ludCwgYmFzZV9wb2ludCkgPCA4MDAwMDBcbiAgICAgIHNlZ21lbnQgPSBlYWNoX2dyb3cgYmFzZV9wb2ludCwgZ3VpZGVfcG9pbnQsIHRlbXBsYXRlXG4gICAgICByZXN1bHQucHVzaCBzZWdtZW50Li4uXG4gICAgICBiYXNlX3BvaW50ID0gZ3VpZGVfcG9pbnRcblxuICByZXN1bHRcblxuZXhwb3J0cy5iZW5kID0gYmVuZCIsIlxucGx1cyA9IChhLCBiKSAtPlxuICB4OiBhLnggKyBiLnhcbiAgeTogYS55ICsgYi55XG4gIHo6IGEueiArIGIuelxuICB3OiBhLncgKyBiLndcblxubWludXMgPSAoYSwgYikgLT5cbiAgeDogYS54IC0gYi54XG4gIHk6IGEueSAtIGIueVxuICB6OiBhLnogLSBiLnpcbiAgdzogYS53IC0gYi53XG5cbiMgeSAqIHogPT0gd1xuIyB6ICogdyA9PiB6ICogeSAqIHogPT4gLSB6ICogeiAqIHkgPT4geVxuIyB3ICogeSA9PiB5ICogeiAqIHkgPT4gelxuIyB5ICogeiAqIHcgPT4gdyAqIHcgPT4gLTFcbm11bHRpcGx5ID0gKGEsIGIpIC0+XG4gIHg6IChhLnggKiBiLngpIC0gKGEueSAqIGIueSkgLSAoYS56ICogYi56KSAtIChhLncgKiBiLncpXG4gIHk6IChhLnggKiBiLnkpICsgKGEueSAqIGIueCkgKyAoYS56ICogYi53KSAtIChhLncgKiBiLnopXG4gIHo6IChhLnggKiBiLnopICsgKGEueiAqIGIueCkgKyAoYS53ICogYi55KSAtIChhLnkgKiBiLncpXG4gIHc6IChhLnggKiBiLncpICsgKGEudyAqIGIueCkgKyAoYS55ICogYi56KSAtIChhLnogKiBiLnkpXG5cbmNvbmp1Z2F0ZSA9IChhKSAtPlxuICB4OiBhLnhcbiAgeTogLSBhLnlcbiAgejogLSBhLnpcbiAgdzogLSBhLndcblxuc3F1YXJlID0gKGEpIC0+IGEgKiBhXG5zdW00U3F1YXJlID0gKGEpIC0+XG4gIHM0ID0gc3F1YXJlXG4gIChzNCBhLngpICsgKHM0IGEueSkgKyAoczQgYS56KSArIChzNCBhLncpXG5cbmxlbmd0aDIgPSAoYSkgLT4gc3VtNFNxdWFyZSBhXG5cbm5vcm0gPSAoYSkgLT4gTWF0aC5wb3cgKGxlbmd0aDIgYSksIDAuNVxuXG5kaXZpZGUgPSAoYSwgYikgLT5cbiAgYyA9IGNvbmp1Z2F0ZSBiXG4gIGQgPSBtdWx0aXBseSBhLCBjXG4gIHJlYWxQYXJ0ID0gc3VtNFNxdWFyZSBiXG4gIGlmIHJlYWxQYXJ0IGlzIDBcbiAgICB4OiAwLCB5OiAwLCB6OiAwLCB3OiAwXG4gIGVsc2VcbiAgICB4OiBkLnggLyByZWFsUGFydFxuICAgIHk6IGQueSAvIHJlYWxQYXJ0XG4gICAgejogZC56IC8gcmVhbFBhcnRcbiAgICB3OiBkLnogLyByZWFsUGFydFxuXG5leHBvcnRzLnBsdXMgPSBwbHVzXG5leHBvcnRzLm1pbnVzID0gbWludXNcbmV4cG9ydHMubXVsdGlwbHkgPSBtdWx0aXBseVxuZXhwb3J0cy5kaXZpZGUgPSBkaXZpZGVcbmV4cG9ydHMubm9ybSA9IG5vcm1cbmV4cG9ydHMubGVuZ3RoMiA9IGxlbmd0aDIiXX0=
;