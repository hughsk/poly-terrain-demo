precision highp float;

vec3 simple_light(vec3 color, vec3 normal, vec3 direction) {
  return color * max(0.0, dot(normal, direction));
}

#pragma glslify: export(simple_light)
