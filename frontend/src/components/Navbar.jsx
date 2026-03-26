import React from 'react';
import { ShoppingBag, Search, User, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="text-xl font-black text-slate-900 tracking-tighter">
          360<span className="text-slate-400 font-light">VIEW</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widst">
          <a href="#" className="text-slate-900">Collections</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Technology</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Sustainable</a>
          <a href="#" className="hover:text-slate-900 transition-colors">About</a>
        </div>
      </div>
      
      <div className="flex items-center gap-5 text-slate-900">
        <button className="hover:scale-110 transition-transform"><Search size={20} strokeWidth={2.5} /></button>
        <button className="hover:scale-110 transition-transform"><User size={20} strokeWidth={2.5} /></button>
        <div className="relative">
          <button className="hover:scale-110 transition-transform"><ShoppingBag size={20} strokeWidth={2.5} /></button>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[8px] font-bold flex items-center justify-center rounded-full">0</span>
        </div>
        <button className="md:hidden"><Menu size={20} strokeWidth={2.5} /></button>
      </div>
    </nav>
  );
}
