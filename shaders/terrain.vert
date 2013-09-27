attribute vec3 position;
attribute vec3 normal;

uniform vec3 uAmbientColor;
uniform vec3 uaDirectionalColor;
uniform vec3 ubDirectionalColor;
uniform vec3 uaLightingDirection;
uniform vec3 ubLightingDirection;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

varying vec3 vLightWeighting;

#pragma glslify: lighting = require(./simple_light)

void main() {
  vLightWeighting = uAmbientColor
    + lighting(uaDirectionalColor, normal, uaLightingDirection)
    + lighting(ubDirectionalColor, normal, ubLightingDirection)
    ;

  gl_Position = projection * view * model * vec4(position, 1.0);
}
