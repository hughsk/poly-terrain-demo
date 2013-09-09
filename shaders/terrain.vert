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

varying vec3 vNorm;
varying vec3 vLightWeighting;

void main() {

  float adlw = max(dot(normal, uaLightingDirection), 0.0);
  float bdlw = max(dot(normal, ubLightingDirection), 0.0);

  vNorm = normal;
  vLightWeighting = uAmbientColor + uaDirectionalColor * adlw + ubDirectionalColor * bdlw;

  gl_Position = projection * view * model * vec4(position, 1.0);
}
