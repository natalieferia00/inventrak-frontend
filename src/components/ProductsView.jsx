import React, { useState } from 'react';
import axios from 'axios';
import { Edit3, Trash2, PackagePlus } from 'lucide-react';

const API = 'https://inventrak-backend.onrender.com/api';

const ProductsView = ({ products, categories, onRefresh }) => {
  const [editing, setEditing] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    
    try {
      if (editing) {
        await axios.put(`${API}/products/${editing.id}`, data);
      } else {
        await axios.post(`${API}/products`, data);
      }
      setEditing(null);
      onRefresh();
      e.target.reset();
      alert("¡Operación exitosa!");
    } catch (err) {
      alert("Error al guardar: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="dashboard-grid animate-fade">
      <section className="table-card">
        <h3><PackagePlus size={20}/> Maestro de Artículos</h3>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>
                  <span className={`badge ${p.current_stock <= p.min_stock_level ? 'low' : 'ok'}`}>
                    {p.current_stock || 0}
                  </span>
                </td>
                <td>
                  <button className="action-btn" onClick={() => setEditing(p)}>
                    <Edit3 size={16}/>
                  </button>
                  <button className="action-btn delete" onClick={async () => {
                    if(window.confirm("¿Estás seguro de eliminar este producto?")) {
                      await axios.delete(`${API}/products/${p.id}`);
                      onRefresh();
                    }
                  }}>
                    <Trash2 size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <aside className="form-card">
        <h4>{editing ? 'Editar Registro' : '+ Nuevo SKU'}</h4>
        <form onSubmit={handleSubmit}>
          <input name="sku" placeholder="SKU (Único)" defaultValue={editing?.sku} required />
          <input name="name" placeholder="Nombre del producto" defaultValue={editing?.name} required />
          <input name="description" placeholder="Descripción (Opcional)" defaultValue={editing?.description} />
          
          <select name="category_id" defaultValue={editing?.category_id || ""} required>
            <option value="" disabled>Seleccionar Categoría</option>
            {categories?.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <div className="form-group">
            <label>Precio Unitario</label>
            <input name="unit_price" type="number" step="0.01" placeholder="0.00" defaultValue={editing?.unit_price} required />
          </div>

          <div className="form-group">
            <label>Stock Mínimo</label>
            <input name="min_stock_level" type="number" placeholder="5" defaultValue={editing?.min_stock_level} required />
          </div>

          <button type="submit" className="btn-primary">
            {editing ? 'GUARDAR CAMBIOS' : 'REGISTRAR PRODUCTO'}
          </button>
          
          {editing && (
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)} style={{marginTop: '10px'}}>
              CANCELAR
            </button>
          )}
        </form>
      </aside>
    </div>
  );
};

export default ProductsView;