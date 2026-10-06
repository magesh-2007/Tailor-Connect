import React from 'react'

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <div key={filter.id} className="filter-group">
          <label className="filter-label">{filter.label}</label>
          <select 
            className="filter-select"
            value={filter.value}
            onChange={(e) => onFilterChange(filter.id, e.target.value)}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      <style>{`
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          padding: 16px 20px;
          background: var(--white);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          margin-bottom: 16px;
        }
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .filter-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .filter-select {
          padding: 6px 12px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 14px;
          color: var(--text);
          background: var(--white);
          cursor: pointer;
          min-width: 120px;
        }
        .filter-select:focus {
          outline: none;
          border-color: var(--primary);
        }
        @media (max-width: 768px) {
          .filter-bar {
            flex-direction: column;
          }
          .filter-group {
            width: 100%;
          }
          .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default FilterBar
