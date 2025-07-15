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
  uniform vec4 u_mouse;
  uniform vec2 u_mouse_prev;
  uniform float u_time;
  uniform int u_frame;

  varying vec2 vUv;

  // Calculates distance from a point to a line segment.
  // This is used to smear the mouse interaction along the path it travels between frames.
  float distToSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
  }

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      if (u_frame < 2) {
          fragColor = vec4(0.0);
          return;
      }
      
      float pressure = texture(u_texture_input, fragCoord / u_resolution).x;
      float pVel = texture(u_texture_input, fragCoord / u_resolution).y;

      // Simplified wave physics using central differences
      float p_right = texture(u_texture_input, (fragCoord + vec2(1.0, 0.0)) / u_resolution).x;
      float p_left = texture(u_texture_input, (fragCoord + vec2(-1.0, 0.0)) / u_resolution).x;
      float p_up = texture(u_texture_input, (fragCoord + vec2(0.0, 1.0)) / u_resolution).x;
      float p_down = texture(u_texture_input, (fragCoord + vec2(0.0, -1.0)) / u_resolution).x;
      
      // Enforce Neumann boundary conditions (for continuous, non-reflecting edges)
      if (fragCoord.x < 1.0) p_left = p_right;
      if (fragCoord.x > u_resolution.x - 2.0) p_right = p_left;
      if (fragCoord.y < 1.0) p_down = p_up;
      if (fragCoord.y > u_resolution.y - 2.0) p_up = p_down;

      // The core of the wave simulation
      pVel += delta * (p_right + p_left + p_up + p_down - 4.0 * pressure) * 0.25;
      pressure += delta * pVel;
      
      // "Spring" motion, gives the waves a more water-like quality
      pVel -= 0.01 * delta * pressure;
      
      // Damping for more realism - waves lose energy over time
      pVel *= 0.995;
      pressure *= 0.995;
      
      // Store pressure, velocity, and the gradient (for distortion)
      fragColor.xyzw = vec4(pressure, pVel, (p_right - p_left) / 2.0, (p_up - p_down) / 2.0);
      
      // Mouse interaction with smooth interpolation
      vec2 mouseCurrent = u_mouse.xy;
      vec2 mousePrevious = u_mouse_prev;
      float radius = 50.0;
      float intensity = 0.3;

      if (distance(mouseCurrent, mousePrevious) < 1.0) { 
          float dist = distance(fragCoord, mouseCurrent);
          if (dist < radius) {
              fragColor.x += pow(1.0 - dist / radius, 2.0) * intensity;
          }
      } else {
          float dist = distToSegment(fragCoord, mousePrevious, mouseCurrent);
          if (dist < radius) {
              fragColor.x += pow(1.0 - dist / radius, 2.0) * intensity;
          }
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
      vec2 uv = vUv;
      vec4 data = texture(u_buffer_texture, uv);
      
      // The gradient from the simulation shader, scaled for distortion effect
      vec2 distortion = 0.25 * data.zw;

      // Chromatic Aberration: sample the texture at slightly different points for R, G, and B channels
      float r = texture(u_text_texture, uv + distortion * 1.01).r;
      float g = texture(u_text_texture, uv + distortion).g;
      float b = texture(u_text_texture, uv + distortion * 0.99).b;
      
      // Combine the channels for the final distorted color
      fragColor = vec4(r, g, b, 1.0);
      
      // Realistic specular highlight (glint)
      // The normal is calculated from the water height gradient
      vec3 normal = normalize(vec3(-data.z, 0.1, -data.w));
      
      // Animate the light direction to make the highlight shimmer
      vec3 lightDir = normalize(vec3(sin(u_time * 0.5), 1.0, cos(u_time * 0.5)));
      
      // Calculate the specular power
      float specular = pow(max(0.0, dot(normal, lightDir)), 40.0);
      
      // Add the white glint to the final color
      fragColor += vec4(1.0) * specular * 0.8;
  }

  void main() {
    mainImage(gl_FragColor, vUv * u_resolution);
  }
`; 