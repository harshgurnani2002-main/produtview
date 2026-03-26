import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import ModelViewer from './ModelViewer';
import Image360Viewer from './Image360Viewer';
import Video360Viewer from './Video360Viewer';
import ProductInfo from './ProductInfo';

export default function ProductDetail({ product, onBack }) {
  if (!product) return null;

  return (
    <div className="flex-1 min-h-screen bg-white flex flex-col relative w-full overflow-x-hidden">
      {/* Back Button Overlay */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-100 text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </button>

      <main className="flex-1 flex flex-col lg:flex-row w-full h-full lg:h-screen lg:overflow-hidden relative">
        {/* Left Side: Media Viewer */}
        <section className="w-full lg:w-3/5 h-[70dvh] min-h-[500px] lg:h-full lg:min-h-0 bg-slate-50 relative border-r border-slate-100 flex-shrink-0 lg:flex-shrink">
          {product.model_3d ? (
            <ModelViewer modelUrl={product.model_3d} />
          ) : product.video_360 ? (
            <Video360Viewer videoUrl={product.video_360} />
          ) : product.images && product.images.length > 0 ? (
            <Image360Viewer images={product.images} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-slate-200 text-slate-500 rounded-sm mb-4">
                No Media Available
              </span>
              <p className="text-sm font-medium">This product does not have a 3D model or 360 images.</p>
            </div>
          )}
        </section>

        {/* Right Side: Product Details */}
        <section className="w-full lg:w-2/5 flex-1 bg-white overflow-y-auto z-10 custom-scrollbar overscroll-contain pb-20 lg:pb-0">
          <ProductInfo product={product} />
        </section>
      </main>
    </div>
  );
}
