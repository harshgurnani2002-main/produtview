import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard, Share2, Heart, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

export default function ProductInfo({ product }) {
  if (!product) return null;

  const formattedDate = new Date(product.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Mock pricing for realism
  const price = 1299.99;
  const originalPrice = 1599.99;
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-8 md:p-12 lg:p-16 flex flex-col h-full bg-white"
    >
      <div className="flex-1">
        {/* Breadcrumbs / Tag */}
        <div className="mb-6 flex items-center justify-between">
          <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
            Exclusive Prototype
          </span>
          <div className="flex gap-4 text-slate-400">
            <button className="hover:text-black transition-colors"><Share2 size={18} /></button>
            <button className="hover:text-red-500 transition-colors"><Heart size={18} /></button>
          </div>
        </div>

        {/* Title & Description */}
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-none">
          {product.name}
        </h1>
        
        <p className="text-slate-500 text-lg mb-8 leading-relaxed font-light">
          {product.description || "A revolutionary 3D masterpiece designed for the modern era. Experience unmatched precision and detail in every polygon."}
        </p>

        {/* Pricing */}
        <div className="mb-10">
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-3xl font-bold text-slate-900">${price}</span>
            <span className="text-xl text-slate-400 line-through">${originalPrice}</span>
            <span className="text-sm font-bold text-green-600">-{discount}% OFF</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Tax included. Shipping calculated at checkout.</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button className="group relative flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-xl font-bold text-sm overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <ShoppingCart size={18} />
            ADD TO CART
          </button>
          <button className="flex items-center justify-center gap-3 bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:bg-slate-200 active:scale-[0.98]">
            <CreditCard size={18} />
            BUY NOW
          </button>
        </div>

        {/* Services / Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-slate-100 mb-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
              <Truck size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-900 uppercase">Free Delivery</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-900 uppercase">2 Year Warranty</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
              <RefreshCcw size={20} />
            </div>
            <span className="text-[10px] font-bold text-slate-900 uppercase">90-Day Return</span>
          </div>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="mt-auto">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>Release Date</span>
          <span className="text-slate-900">{formattedDate}</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-300 italic text-center uppercase tracking-thinnest">
          This is a high-fidelity prototype only.
        </div>
      </div>
    </motion.div>
  );
}
