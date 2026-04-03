import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpDown } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const MovementsView = ({ products, onRefresh }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get(`${API}/movements`).then(res => setHistory(res.data));
  }, [products]);

  const handleMovement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/movements`, Object.fromEntries(new FormData(e.target)));
      onRefresh();
      e.target.reset();
    } catch (err) { alert("Error en transacción"); }
  };

  return (
    <div className="dashboard-grid animate-fade">
      <section className="table-card">
        <h3><ArrowUpDown size={20}/> Historial de Movimientos</h3>
        <table className="inventory-table">
          <thead><tr><th>Fecha</th><th>Item</th><th>Tipo</th><th>Cant.</th></tr></thead>
          <tbody>
            {history.map(m => (
              <tr key={m.id}>
                <td>{new Date(m.movement_date).toLocaleDateString()}</td>
                <td>{m.product_name}</td>
                <td><span className={`badge ${m.type === 'IN' ? 'ok' : 'low'}`}>{m.type}</span></td>
                <td>{m.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <aside className="form-card">
        <h4>Registrar Stock</h4>
        <form onSubmit={handleMovement}>
          <select name="product_id" required>
            <option value="">Seleccionar Producto...</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select name="type">
            <option value="IN">ENTRADA (+)</option>
            <option value="OUT">SALIDA (-)</option>
          </select>
          <input name="quantity" type="number" placeholder="Cantidad" required />
          <input name="reason" placeholder="Motivo" required />
          <button className="btn-primary">EJECUTAR</button>
        </form>
      </aside>
    </div>
  );
};

export default MovementsView;