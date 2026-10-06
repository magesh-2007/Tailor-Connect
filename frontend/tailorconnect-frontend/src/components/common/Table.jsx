import React from 'react'

const Table = ({ 
  columns, 
  data = [], 
  onRowClick = null,
  className = ''
}) => {
  return (
    <div className={`table-wrapper ${className}`}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width || 'auto' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr 
                key={index} 
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <style>{`
        .table-wrapper {
          overflow-x: auto;
          background: var(--white);
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .table thead {
          background: var(--background);
          border-bottom: 2px solid var(--border);
        }
        .table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: var(--text-light);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .table td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          color: var(--text);
        }
        .table tbody tr:hover {
          background: var(--primary-light);
        }
        .table tbody tr:last-child td {
          border-bottom: none;
        }
        .table-empty {
          text-align: center;
          color: var(--text-light);
          padding: 40px 16px;
        }
      `}</style>
    </div>
  )
}

export default Table
