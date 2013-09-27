var mesher = require('heightmap-mesher')
var camera = require('basic-camera')()
var normals = require('mesh-normals')
var createSidebar = require('./sidebar')

var shell = require('gl-now')({ clearColor: [1, 1, 1, 0] })
var perlin = require('perlin').noise.perlin2
var fill = require('ndarray-fill')
var zero = require('zeros')
var fs = require('fs')

var createShader = require('gl-shader')
var createBuffer = require('gl-buffer')
var createVAO = require('gl-vao')
var glm = require('gl-matrix')
var mat4 = glm.mat4
var vec2 = glm.vec2
var quat = glm.quat

shell.on('gl-init', init)
shell.on('gl-render', render)

var meshes = []
var sidebar
var shader

function init() {
  var gl = shell.gl

  shader = createShader(gl
    , require('./shaders/terrain.vert')
    , require('./shaders/terrain.frag')
  )

  meshes = []

  for (var x = -3; x <= 3; x++)
  for (var y = -3; y <= 3; y++) {
    meshes.push(createMesh(gl, x, y))
  }

  sidebar = createSidebar()
}

var model = mat4.identity(new Float32Array(16))
var tempm = mat4.identity(new Float32Array(16))
var gridp = [0,0,0]
var scale = [15,3.5,15]
var t = 0
function render() {
  var gl = shell.gl
  t += 1

  camera.rotateY(Math.sin(t / 100 + Math.PI) * 0.0025 + 0.001)
  camera.position[1] = -1
  camera.position[2] += Math.sin(t / 250) * 0.05

  var projection = mat4.perspective(new Float32Array(16), 0.25*Math.PI, shell.width/shell.height, 0.05, 1000)
  var view = camera.view()

  gl.enable(gl.CULL_FACE)
  gl.enable(gl.DEPTH_TEST)

  shader.bind()
  shader.uniforms.projection = projection
  shader.uniforms.view = view

  shader.uniforms.uaLightingDirection = [Math.max(0.2,Math.sin(0.015 * t)*1.2),Math.max(0.2,Math.cos(0.01132 * t)*1.2), -1]
  shader.uniforms.uaDirectionalColor = [(+sidebar.dr.value|0)/255, (+sidebar.dg.value|0)/255, (+sidebar.db.value|0)/255]

  shader.uniforms.ubLightingDirection = [Math.max(0.2,Math.cos(0.015 * t + 0.5)*1.2),Math.max(0.2,Math.sin(0.01132 * t + 0.3)*1.2), -1]
  shader.uniforms.ubDirectionalColor = [(+sidebar.br.value|0)/255, (+sidebar.bg.value|0)/255, (+sidebar.bb.value|0)/255]

  shader.uniforms.uAmbientColor = [(+sidebar.ar.value|0)/255, (+sidebar.ag.value|0)/255, (+sidebar.ab.value|0)/255]

  shader.attributes.position.location = 0
  shader.attributes.normal.location = 1

  for (var i = 0; i < meshes.length; i += 1) {
    gridp[0] = (meshes[i].x - 0.5) * scale[0]
    gridp[1] = -0.35 * scale[1]
    gridp[2] = (meshes[i].y - 0.5) * scale[2]

    mat4.translate(model, tempm, gridp)
    shader.uniforms.model = model

    meshes[i].vao.bind()
    gl.drawArrays(gl.TRIANGLES, 0, meshes[i].length)
    meshes[i].vao.unbind()
  }
}

function createMesh(gl, x, y) {
  var vertData = mesher(
    perlinify(
        zero([64, 64])
      , x
      , y
    ), 0.25
  )

  for (var i = 0; i < vertData.length; i += 3) {
    vertData[i  ] *= scale[0]
    vertData[i+1] *= scale[1]
    vertData[i+2] *= scale[2]
  }

  var normData = normals(vertData)
  var vertBuffer = createBuffer(gl, vertData)
  var quads = createVAO(gl, null, [{
    buffer: vertBuffer
    , type: gl.FLOAT
    , size: 3
    , offset: 0
    , stride: 0
    , normalized: false
  }, {
    buffer: createBuffer(gl, normData)
    , type: gl.FLOAT
    , size: 3
    , offset: 0
    , stride: 0
    , normalized: false
  }])

  return { vao: quads, length: vertData.length / 3, x: x, y: y }
}

function perlinify(array, _x, _y) {
  _x *= array.shape[0] - 1
  _y *= array.shape[1] - 1
  return fill(array, function(x, y) {
    var v = perlin((x + _x) * 0.055 + 972, (y + _y) * 0.055 - 234)
    v += perlin((x + _x) * 0.5 + 102.01, (y + _y) * 0.5 - 948.01) * 0.05
    v += perlin((x + _x) * 0.005 + 152.01, (y + _y) * 0.005 - 448.01) * 0.25
    // if (v < 0) v = ~~(v*5)/5
    return v
  })
}
