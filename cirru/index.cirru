doctype
html
  head
    meta (:charset utf-8)
    title (= 3js)
    script (:src bower_components/three.js/three.js)
    script (:defer) (:src build/build.js)
    link (:rel stylesheet) (:href css/page.css)
  body#main