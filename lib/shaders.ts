export const simulationVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const simulationFragmentShader = `
  const float delta = 1.0;

  uniform vec2 u_resolution;
  uniform sampler2D u_texture_input;
  uniform vec4 u_mouse; // Current mouse: xy = pos, z = click state (though z is not used in this version)
  uniform float u_time;
  uniform int u_frame;

  varying vec2 vUv;

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      if (u_frame == 0) { 
          fragColor = vec4(0.0);
          return;
      }
      
      float pressure = texture(u_texture_input, fragCoord / u_resolution).x;
      float pVel = texture(u_texture_input, fragCoord / u_resolution).y;

      float p_right = texture(u_texture_input, (fragCoord + vec2(1.0, 0.0)) / u_resolution).x;
      float p_left = texture(u_texture_input, (fragCoord + vec2(-1.0, 0.0)) / u_resolution).x;
      float p_up = texture(u_texture_input, (fragCoord + vec2(0.0, 1.0)) / u_resolution).x;
      float p_down = texture(u_texture_input, (fragCoord + vec2(0.0, -1.0)) / u_resolution).x;
      
      if (fragCoord.x == 0.5) p_left = p_right;
      if (fragCoord.x == u_resolution.x - 0.5) p_right = p_left;
      if (fragCoord.y == 0.5) p_down = p_up;
      if (fragCoord.y == u_resolution.y - 0.5) p_up = p_down;

      pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
      pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;
      pressure += delta * pVel;
      pVel -= 0.005 * delta * pressure;
      pVel *= 1.0 - 0.002 * delta;
      pressure *= 0.998;
      
      fragColor.xyzw = vec4(pressure, pVel, (p_right - p_left) / 2.0, (p_up - p_down) / 2.0);
      
      vec2 mouseCurrent = u_mouse.xy;
      float radius = 70.0;
      float intensity = 0.25;

      float dist = distance(fragCoord, mouseCurrent);
      if (dist <= radius) {
          fragColor.x += (1.0 - dist / radius) * intensity;
      }
  }

  void main() {
    mainImage(gl_FragColor, vUv * u_resolution);
  }
`;

export const renderVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const renderFragmentShader = `
  uniform vec2 u_resolution; 
  uniform sampler2D u_buffer_texture; 
  uniform sampler2D u_text_texture; 
  uniform float u_time; 

  varying vec2 vUv;

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      vec2 uv = fragCoord/u_resolution.xy;
      vec4 data = texture(u_buffer_texture, uv);
      fragColor = texture(u_text_texture, uv + 0.1 * data.zw); 
      vec3 normal = normalize(vec3(-data.z, 0.2, -data.w)); 
      fragColor += vec4(1.0) * pow(max(0.0, dot(normal, normalize(vec3(-3.0, 10.0, 3.0)))), 60.0);
  }

  void main() {
    mainImage(gl_FragColor, vUv * u_resolution);
  }
`; 