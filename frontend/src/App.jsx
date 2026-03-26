import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/');
        if (response.data && response.data.length > 0) {
          // Normalize media URLs if needed
          const normalizedProducts = response.data.map(product => {
            if (product.model_3d && !product.model_3d.startsWith('http')) {
              product.model_3d = `http://localhost:8000${product.model_3d}`;
            }
            if (product.video_360 && !product.video_360.startsWith('http')) {
              product.video_360 = `http://localhost:8000${product.video_360}`;
            }
            if (product.images) {
               product.images = product.images.map(img => ({
                 ...img,
                 image: img.image.startsWith('http') ? img.image : `http://localhost:8000${img.image}`
               }));
            }
            return product;
          });
          setProducts(normalizedProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-1 bg-slate-100 overflow-hidden relative rounded-full">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
              className="absolute inset-0 bg-black" 
            />
          </div>
          <span className="text-[10px] font-black text-slate-900 tracking-widest uppercase">Initializing Catalog</span>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">System Offline</h2>
            <p className="text-slate-400 mb-8 font-medium leading-relaxed">
              {error || "No products found in the database. Please create a product via the Django admin or API."}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-black text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-black selection:text-white flex flex-col overflow-x-hidden">
      <Navbar />
      
      {/* Smoothly transition between List and Detail views */}
      <main className="flex-1 flex flex-col w-full relative pt-20 lg:pt-0">
        {!selectedProduct ? (
          <ProductList products={products} onSelectProduct={setSelectedProduct} />
        ) : (
          <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />
        )}
      </main>

      {/* Modern Footer (Subtle) */}
      {!selectedProduct && (
        <footer className="p-8 lg:p-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[12px] font-black tracking-tighter uppercase">360VIEW PROTOTYPE</div>
          <div className="flex items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-black transition-colors">© 2026</a>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;

