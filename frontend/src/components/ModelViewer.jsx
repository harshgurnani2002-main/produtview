import React, { Suspense, memo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Stage } from '@react-three/drei';
import * as THREE from 'three';

// Move Model to a separate component and memoize it
const Model = memo(({ url }) => {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(ref.current);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    // Normalize scale (fit within a 2-unit box)
    const maxDim = Math.max(size.x, size.y, size.z);

    // Prevent division by zero just in case
    if (maxDim === 0) return;

    const scale = 2 / maxDim;

    ref.current.scale.setScalar(scale);

    // Recenter model around origin
    ref.current.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );
  }, [scene]);

  return <primitive ref={ref} object={scene} />;
});

export default function ModelViewer({ modelUrl }) {
  return (
    <div className="w-full h-[500px] md:h-full relative bg-slate-50 overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [0, 0, 3], fov: 45 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          <Stage environment="studio" intensity={0.5}>
            <Model url={modelUrl} />
          </Stage>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          minDistance={1.5}
          maxDistance={6}
          makeDefault
        />

        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
      </Canvas>

      {/* Interaction Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm text-xs text-slate-500 font-medium pointer-events-none border border-slate-100 uppercase tracking-widest z-10">
        Drag to Rotate • Scroll to Zoom
      </div>
    </div>
  );
}

// Preload to avoid late loading issues
// useGLTF.preload(modelUrl)
