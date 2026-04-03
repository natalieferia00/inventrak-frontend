import React from 'react';
import axios from 'axios';
import { Layers, Trash2 } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const CategoriesView = ({ categories, onRefresh }) => (
  <div className="dashboard-grid animate-fade">
    <section className="table-card">
      <h3><Layers size={20}/> Gestión de Categorías</h3>
      <table className="inventory-table">
        <thead><tr><th>Nombre</th><th>Acciones</th></tr></thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td style={{color: 'var(--primary-cyan)'}}>{c.name}</td>
              <td>
                <button className="action-btn delete" onClick={async () => {
                  if(confirm("¿Borrar?")) { await axios.delete(`${API}/categories/${c.id}`); onRefresh(); }
                }}><Trash2 size={16}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
    <aside className="form-card">
      <h4>Nueva Categoría</h4>
      <form onSubmit={async (e) => {
        e.preventDefault();
        await axios.post(`${API}/categories`, { name: e.target.catName.value });
        onRefresh(); e.target.reset();
      }}>
        <input name="catName" placeholder="Nombre (Ej: Electrónica)" required />
        <button className="btn-primary">AÑADIR</button>
      </form>
    </aside>
  </div>
);

export default CategoriesView;