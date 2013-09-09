precision mediump float;

varying vec3 vNorm;
varying vec3 vLightWeighting;

void main() {
  // (fog is white)
  const vec3 fogColor = vec3(1.0);

  // Fog Calculations:
  const float LOG2 = 1.442695;
  const float density = 0.05125;
  float z = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = 1.0 - clamp(exp2(-density * density * z * z * LOG2), 0.0, 1.0);

  vec3 terrainColor = vLightWeighting * vec3(0.5); // vec3(vNorm.x, vNorm.y, 0.5);

  gl_FragColor = vec4(
    mix(
      terrainColor,
      fogColor,
      fogFactor
    ), 1.0
  );
}
