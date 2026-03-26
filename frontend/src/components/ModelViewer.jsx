import React, { Suspense, memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Stage } from '@react-three/drei';

// Move Model to a separate component and memoize it
const Model = memo(({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.2} />;
});

export default function ModelViewer({ modelUrl }) {
  return (
    <div className="w-full h-[500px] md:h-full relative bg-slate-50 overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [0, 1, 5], fov: 45 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          <Stage environment="studio" intensity={0.5} contactShadow={{ opacity: 0.4, blur: 2 }} adjustCamera={true}>
            <Model url={modelUrl} />
          </Stage>
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
          minDistance={2}
          maxDistance={10}
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
