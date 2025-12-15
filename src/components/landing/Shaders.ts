// Custom shaders for Three.js effects

export const glowVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const glowFragmentShader = `
  uniform float uIntensity;
  uniform vec3 uColor;
  uniform float uTime;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    float fresnel = pow(1.0 - dot(normal, vec3(0.0, 0.0, 1.0)), 2.0);
    
    // Pulsing effect
    float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
    float intensity = uIntensity * (0.7 + pulse * 0.3);
    
    // Glow effect - enhanced for visibility
    float glow = fresnel * intensity;
    vec3 color = uColor * glow * 1.5; // Brightened
    
    gl_FragColor = vec4(color, glow * 1.2); // Increased alpha
  }
`

export const particleVertexShader = `
  attribute float aSize;
  attribute float aOpacity;
  attribute vec3 aColor;
  uniform float uTime;
  varying float vOpacity;
  varying vec3 vColor;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vColor = aColor;
    vOpacity = aOpacity;
    
    vec3 pos = position;
    // Subtle floating animation
    pos.y += sin(uTime * 0.5 + position.x * 0.1) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

export const particleFragmentShader = `
  uniform sampler2D uTexture;
  varying float vOpacity;
  varying vec3 vColor;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(gl_PointCoord, center);
    
    // Soft circular particle
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= vOpacity;
    
    vec3 color = vColor;
    gl_FragColor = vec4(color, alpha);
  }
`

export const connectionVertexShader = `
  varying vec3 vPosition;
  varying float vDistance;

  void main() {
    vPosition = position;
    vDistance = length(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const connectionFragmentShader = `
  uniform float uIntensity;
  uniform vec3 uColor;
  uniform float uTime;
  varying vec3 vPosition;
  varying float vDistance;

  void main() {
    // Animated flow effect along the connection
    float flow = sin(vDistance * 2.0 - uTime * 2.0) * 0.5 + 0.5;
    float alpha = uIntensity * (0.5 + flow * 0.3); // Increased base visibility
    
    vec3 color = uColor * alpha;
    gl_FragColor = vec4(color, alpha * 0.9); // Increased alpha for visibility
  }
`

