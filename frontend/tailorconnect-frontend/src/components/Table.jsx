import React from 'react'

export default function Table({ columns, data, emptyMessage = 'No records found.' }) {
  if (!data || data.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>
  }
  return (
    <div className="table-wrapper">
      <table className="app-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
