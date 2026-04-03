import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Package, ArrowUpDown, Layers } from 'lucide-react';
import './App.css';

// --- IMPORTACIÓN DE COMPONENTES ---
// Verifica que estos archivos existan en src/components/
import Dashboard from './components/Dashboard';
import ProductsView from './components/ProductsView';
import MovementsView from './components/MovementsView';
import CategoriesView from './components/CategoriesView';

// URL de tu API en Render (Ya conectada a tu DB de Railway)
const API = 'https://inventrak-backend.onrender.com/api';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [refresh, setRefresh] = useState(0); // Estado para forzar la sincronización
  const [loading, setLoading] = useState(true);

  // Función global para refrescar datos desde cualquier vista
  const triggerRefresh = () => setRefresh(prev => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Peticiones en paralelo para optimizar la carga
        const [resP, resC] = await Promise.all([
          axios.get(`${API}/products`),
          axios.get(`${API}/categories`)
        ]);
        setProducts(resP.data);
        setCategories(resC.data);
      } catch (err) {
        console.error("Error al sincronizar con el servidor de Render:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh]);

  return (
    <Router>
      <div className="app-container">
        {/* BARRA LATERAL (SIDEBAR) */}
        <aside className="sidebar">
          <div className="logo-section">
            <h1>InvenTrak</h1>
          </div>
          <nav className="nav-links">
            <CustomLink to="/" icon={<LayoutDashboard size={20}/>} label="DASHBOARD" />
            <CustomLink to="/productos" icon={<Package size={20}/>} label="PRODUCTOS" />
            <CustomLink to="/movimientos" icon={<ArrowUpDown size={20}/>} label="STOCK" />
            <CustomLink to="/categorias" icon={<Layers size={20}/>} label="CATEGORÍAS" />
          </nav>
          <div className="sidebar-footer">
            <span className={`status-dot ${loading ? 'syncing' : 'online'}`}></span>
            {loading ? 'SINCRONIZANDO...' : 'SISTEMA ONLINE'}
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <Dashboard products={products} categories={categories} />
            } />
            <Route path="/productos" element={
              <ProductsView 
                products={products} 
                categories={categories} 
                onRefresh={triggerRefresh} 
              />
            } />
            <Route path="/categorias" element={
              <CategoriesView 
                categories={categories} 
                onRefresh={triggerRefresh} 
              />
            } />
            <Route path="/movimientos" element={
              <MovementsView 
                products={products} 
                onRefresh={triggerRefresh} 
              />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

/**
 * Componente auxiliar para manejar los enlaces activos del menú
 */
function CustomLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`nav-item ${isActive ? 'active' : ''}`}>
      {icon} <span>{label}</span>
    </Link>
  );
}

export default App;