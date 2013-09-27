precision highp float;

#pragma glslify: fog = require(./fog)

varying vec3 vLightWeighting;
const float FOG_DENSITY = 0.05125;

void main() {
  vec3 terrainColor = vLightWeighting * vec3(0.5);
  gl_FragColor = vec4(mix(terrainColor, vec3(1.0), fog(FOG_DENSITY)), 1.0);
}
