import React from 'react';
import { motion } from 'framer-motion';

export default function ProductList({ products, onSelectProduct }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex-1 min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center text-slate-400 font-medium">
          No products found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white p-6 md:p-12 lg:p-16 min-h-screen">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
          New Arrivals
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Discover our latest 3D and 360° prototypes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => {
          // Determine the thumbnail image
          let thumbnail = null;
          if (product.images && product.images.length > 0) {
            // Sort by order and pick the first
            const sorted = [...product.images].sort((a, b) => a.order - b.order);
            thumbnail = sorted[0].image;
          }

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="group cursor-pointer flex flex-col"
              onClick={() => onSelectProduct(product)}
            >
              {/* Thumbnail Container */}
              <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-4 relative flex items-center justify-center border border-slate-100 group-hover:border-slate-300 transition-colors">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover origin-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 flex-col gap-2">
                    {product.model_3d ? (
                      <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-slate-200 text-slate-500 rounded-sm">3D Model</span>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-widest">No Media</span>
                    )}
                  </div>
                )}
                
                {/* Media Type Badge */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {product.images && product.images.length > 0 && (
                    <span className="bg-black/80 backdrop-blur text-white text-[9px] font-black px-2 py-1 rounded-sm tracking-widest uppercase">
                      360°
                    </span>
                  )}
                  {product.model_3d && (
                    <span className="bg-black/80 backdrop-blur text-white text-[9px] font-black px-2 py-1 rounded-sm tracking-widest uppercase">
                      3D
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1 truncate">
                  {product.description}
                </p>
                <div className="mt-3 font-bold text-slate-900">
                  $1299.99
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
