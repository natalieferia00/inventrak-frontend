import React from 'react';
import { LayoutDashboard, Package, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ products }) => {
  const totalSkus = products.length;
  const lowStock = products.filter(p => p.current_stock <= p.min_stock_level && p.current_stock > 0);
  const outOfStock = products.filter(p => p.current_stock === 0);
  const totalValue = products.reduce((acc, p) => acc + (p.current_stock * (p.unit_price || 0)), 0);

  const barData = [...products]
    .sort((a, b) => b.current_stock - a.current_stock)
    .slice(0, 6)
    .map(p => ({ name: p.name, stock: p.current_stock }));

  return (
    <div className="view-container animate-fade">
      <h2 className="view-title"><LayoutDashboard size={24}/> Panel de Control</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <Package size={20} color="#0DFDFF"/>
          <div><span>Total SKUs</span><h3>{totalSkus}</h3></div>
        </div>
        <div className="stat-card accent-warning">
          <AlertCircle size={20} color="#F1C40F"/>
          <div><span>Stock Bajo</span><h3>{lowStock.length}</h3></div>
        </div>
        <div className="stat-card accent-danger">
          <TrendingUp size={20} color="#FF4B4B"/>
          <div><span>Agotados</span><h3>{outOfStock.length}</h3></div>
        </div>
        <div className="stat-card accent-success">
          <CheckCircle size={20} color="#2ecc71"/>
          <div><span>Valor Activos</span><h3>${totalValue.toLocaleString()}</h3></div>
        </div>
      </div>

      <div className="chart-container">
        <h4>Top 6 Existencias en Almacén</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" vertical={false} />
            <XAxis dataKey="name" stroke="#8B949E" fontSize={10} />
            <YAxis stroke="#8B949E" fontSize={10} />
            <Tooltip contentStyle={{ background: '#161B22', border: '1px solid #30363D' }} />
            <Bar dataKey="stock" fill="#0DFDFF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;