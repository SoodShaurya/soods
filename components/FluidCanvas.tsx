'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { simulationVertexShader, simulationFragmentShader, renderVertexShader, renderFragmentShader } from '../lib/shaders';

const FluidCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainSceneRef = useRef<THREE.Scene | null>(null);
  const simSceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const mouseRef = useRef(new THREE.Vector4(0, 0, 0, 0)); // x, y, isMouseDown (z), notUsed (w)
  const frameRef = useRef(0);
  const rtaRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const rtbRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const simulationMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const renderMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const textTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const textCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const updateTextTexture = useCallback(() => {
    if (!textCanvasRef.current || !textTextureRef.current) return;

    const canvas = textCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const textureWidth = window.innerWidth * dpr;
    const textureHeight = window.innerHeight * dpr;

    canvas.width = textureWidth;
    canvas.height = textureHeight;

    ctx.fillStyle = '#40E0D0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fontSize = Math.min(textureWidth / 5, textureHeight / 2.5) * dpr;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('soods', canvas.width / 2, canvas.height / 2);

    textTextureRef.current.needsUpdate = true;
  }, []);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const currentMount = mountRef.current;

    mainSceneRef.current = new THREE.Scene();
    simSceneRef.current = new THREE.Scene();

    cameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    cameraRef.current.position.z = 1;

    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.domElement.id = 'fluid-canvas';
    currentMount.appendChild(rendererRef.current.domElement);

    const dpr = Math.min(window.devicePixelRatio, 2);
    let simWidth = window.innerWidth * dpr;
    let simHeight = window.innerHeight * dpr;
    
    mouseRef.current.x = simWidth / 2;
    mouseRef.current.y = simHeight / 2;

    const renderTargetOptions = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType, 
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
    };

    rtaRef.current = new THREE.WebGLRenderTarget(simWidth, simHeight, renderTargetOptions);
    rtbRef.current = new THREE.WebGLRenderTarget(simWidth, simHeight, renderTargetOptions);

    simulationMaterialRef.current = new THREE.ShaderMaterial({
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
      uniforms: {
        u_texture_input: { value: rtaRef.current.texture },
        u_mouse: { value: mouseRef.current },
        u_resolution: { value: new THREE.Vector2(simWidth, simHeight) },
        u_time: { value: 0.0 },
        u_frame: { value: 0 },
      },
    });

    textCanvasRef.current = document.createElement('canvas');
    textTextureRef.current = new THREE.CanvasTexture(textCanvasRef.current);
    textTextureRef.current.minFilter = THREE.LinearFilter;
    textTextureRef.current.magFilter = THREE.LinearFilter;
    textTextureRef.current.format = THREE.RGBAFormat;
    updateTextTexture(); 

    renderMaterialRef.current = new THREE.ShaderMaterial({
      vertexShader: renderVertexShader,
      fragmentShader: renderFragmentShader,
      uniforms: {
        u_buffer_texture: { value: rtbRef.current.texture },
        u_text_texture: { value: textTextureRef.current },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }, 
        u_time: { value: 0.0 },
      },
      transparent: true,
    });

    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const simulationMesh = new THREE.Mesh(planeGeometry, simulationMaterialRef.current);
    simSceneRef.current.add(simulationMesh);

    const renderMesh = new THREE.Mesh(planeGeometry, renderMaterialRef.current);
    mainSceneRef.current.add(renderMesh);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const newDpr = Math.min(window.devicePixelRatio, 2);
      simWidth = width * newDpr;
      simHeight = height * newDpr;

      if (rendererRef.current) {
        rendererRef.current.setSize(width, height);
        rendererRef.current.setPixelRatio(newDpr);
      }
      if (cameraRef.current) {
        cameraRef.current.updateProjectionMatrix();
      }
      if (rtaRef.current && rtbRef.current) {
        rtaRef.current.setSize(simWidth, simHeight);
        rtbRef.current.setSize(simWidth, simHeight);
      }
      if (simulationMaterialRef.current) {
        simulationMaterialRef.current.uniforms.u_resolution.value.set(simWidth, simHeight);
      }
      if (renderMaterialRef.current) {
        renderMaterialRef.current.uniforms.u_resolution.value.set(width, height);
      }
      updateTextTexture();
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (event: MouseEvent) => {
      if (rendererRef.current) {
        const dpr = rendererRef.current.getPixelRatio();
        mouseRef.current.x = event.clientX * dpr;
        mouseRef.current.y = (window.innerHeight - event.clientY) * dpr; 
      }
    };
    const handleMouseDown = () => { mouseRef.current.z = 1.0; };
    const handleMouseUp = () => { mouseRef.current.z = 0.0; };
    const handleMouseLeave = () => {
        const dpr = rendererRef.current?.getPixelRatio() || 1;
        const leaveX = window.innerWidth * dpr / 2;
        const leaveY = window.innerHeight * dpr / 2;
        
        mouseRef.current.x = leaveX; 
        mouseRef.current.y = leaveY;
        mouseRef.current.z = 0.0; 
    };

    if (rendererRef.current) {
        rendererRef.current.domElement.addEventListener('mousemove', handleMouseMove);
        rendererRef.current.domElement.addEventListener('mousedown', handleMouseDown);
        rendererRef.current.domElement.addEventListener('mouseup', handleMouseUp);
        rendererRef.current.domElement.addEventListener('mouseleave', handleMouseLeave);
    }

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!rendererRef.current || !simSceneRef.current || !mainSceneRef.current || !cameraRef.current || !simulationMaterialRef.current || !renderMaterialRef.current || !rtaRef.current || !rtbRef.current) return;

      frameRef.current++;
      const elapsedTime = clock.getElapsedTime();

      simulationMaterialRef.current.uniforms.u_time.value = elapsedTime;
      simulationMaterialRef.current.uniforms.u_frame.value = frameRef.current;
      simulationMaterialRef.current.uniforms.u_mouse.value = mouseRef.current;
      simulationMaterialRef.current.uniforms.u_texture_input.value = rtaRef.current.texture;

      rendererRef.current.setRenderTarget(rtbRef.current);
      rendererRef.current.render(simSceneRef.current, cameraRef.current);
      rendererRef.current.setRenderTarget(null);

      renderMaterialRef.current.uniforms.u_time.value = elapsedTime;
      renderMaterialRef.current.uniforms.u_buffer_texture.value = rtbRef.current.texture;
      renderMaterialRef.current.uniforms.u_text_texture.value = textTextureRef.current;

      rendererRef.current.render(mainSceneRef.current, cameraRef.current);

      const temp = rtaRef.current;
      rtaRef.current = rtbRef.current;
      rtbRef.current = temp;
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.removeEventListener('mousemove', handleMouseMove);
        rendererRef.current.domElement.removeEventListener('mousedown', handleMouseDown);
        rendererRef.current.domElement.removeEventListener('mouseup', handleMouseUp);
        rendererRef.current.domElement.removeEventListener('mouseleave', handleMouseLeave);
        if (currentMount && rendererRef.current.domElement.parentNode === currentMount) {
            currentMount.removeChild(rendererRef.current.domElement);
        }
      }
      if(rendererRef.current) rendererRef.current.dispose();
      if(rtaRef.current) rtaRef.current.dispose();
      if(rtbRef.current) rtbRef.current.dispose();
      if(simulationMaterialRef.current) simulationMaterialRef.current.dispose();
      if(renderMaterialRef.current) renderMaterialRef.current.dispose();
      if(textTextureRef.current) textTextureRef.current.dispose();
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateTextTexture]);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1 }} />;
};

export default FluidCanvas; 