import React from 'react';
import { Pencil, Trash2 } from 'lucide-react'; // Importa los iconos correctamente

const ProductsView = ({ products, onEdit, onDelete }) => {
  return (
    <div className="card-table">
      <h2>📦 MAESTRO DE ARTÍCULOS</h2>
      
      <table className="table-cyberpunk">
        <thead>
          <tr>
            <th className="col-sku">SKU</th>
            <th className="col-nombre">NOMBRE</th>
            <th className="col-descripcion">DESCRIPCIÓN</th> {/* <- La columna que faltaba */}
            <th className="col-stock">STOCK</th>
            <th className="col-acciones">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="col-sku">{product.sku}</td>
              <td className="col-nombre">{product.name}</td>
              
              {/* <- Mostramos la descripción (o un guion si está vacía) */}
              <td className="col-descripcion">
                {product.description ? product.description : '—'}
              </td>
              
              <td className="col-stock">{product.current_stock}</td>
              
              <td className="col-acciones">
                <button className="action-btn edit" onClick={() => onEdit(product)}>
                  <Pencil size={18} />
                </button>
                <button className="action-btn trash" onClick={() => onDelete(product.id)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsView;