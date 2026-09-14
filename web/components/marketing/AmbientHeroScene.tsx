'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const AmbientHeroScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    currentMount.appendChild(renderer.domElement);

    // Neo-Brutalist Spatial Drafting Grid
    // Engineering coordinates plane rendered as stark crisp lines
    const gridHelper = new THREE.GridHelper(18, 18, 0x0a0a0a, 0xd4d4d8);
    gridHelper.position.y = -2.5;
    gridHelper.rotation.x = 0.25;
    scene.add(gridHelper);

    // Structural node markers: stark black wireframe markers
    const group = new THREE.Group();
    const nodeCount = 14;
    const nodeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const edgesGeometry = new THREE.EdgesGeometry(nodeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0a0a0a, linewidth: 1.5 });

    for (let i = 0; i < nodeCount; i++) {
      const wireframeBox = new THREE.LineSegments(edgesGeometry, lineMaterial);
      wireframeBox.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 6 + 0.5,
        (Math.random() - 0.5) * 4
      );
      group.add(wireframeBox);
    }
    scene.add(group);

    // Inter-node engineering connection vectors
    const points: THREE.Vector3[] = [];
    group.children.forEach((child) => {
      points.push(child.position.clone());
    });

    const linesGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const vectorMaterial = new THREE.LineBasicMaterial({
      color: 0x71717a,
      transparent: true,
      opacity: 0.25,
    });
    const connectionLines = new THREE.Line(linesGeometry, vectorMaterial);
    scene.add(connectionLines);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationId: number;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTime) * 0.0005;

      // Slow, precise structural rotation (engineering schematic drift)
      group.rotation.y = elapsed * 0.15 + mouseX;
      group.rotation.x = mouseY * 0.5;
      gridHelper.rotation.z = Math.sin(elapsed * 0.2) * 0.02;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      gridHelper.dispose();
      edgesGeometry.dispose();
      lineMaterial.dispose();
      linesGeometry.dispose();
      vectorMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40"
      aria-hidden="true"
    />
  );
};
