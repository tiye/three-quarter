
A fractal curve but rendered in 3D
------

3D version of [Snowflake](https://github.com/jiyinyiyong/snowflake)

Live demo: http://repo.tiye.me/three-quarter/

I'm using Quaternion to calculate the curves.

Most of the rendering code is based on Three.js' demo of dragging:
http://threejs.org/examples/webgl_interactive_draggablecubes.html

### Build

Build code with repo:

```bash
bower i # install Three.js
npm i
coffee make.coffee compile
```

`index.html` is the entry of this project.

### License

MIT