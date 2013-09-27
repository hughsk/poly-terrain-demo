float fog(float density) {
  const float LOG2 = 1.442695;
  float z = gl_FragCoord.z / gl_FragCoord.w;
  return 1.0 - exp2(-density * density * z * z * LOG2);
}

#pragma glslify: export(fog)
