import React, { useState } from 'react'

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  value = '',
  onChange = null
}) => {
  const [searchValue, setSearchValue] = useState(value)

  const handleChange = (e) => {
    const val = e.target.value
    setSearchValue(val)
    if (onChange) onChange(val)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(searchValue)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
      />
      <button type="submit" className="search-btn">🔍</button>
      <style>{`
        .search-bar {
          display: flex;
          align-items: center;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0 12px;
          transition: var(--transition);
        }
        .search-bar:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.1);
        }
        .search-input {
          flex: 1;
          padding: 10px 12px;
          border: none;
          background: transparent;
          font-size: 14px;
          color: var(--text);
          outline: none;
        }
        .search-input::placeholder {
          color: var(--text-light);
        }
        .search-btn {
          background: none;
          border: none;
          font-size: 18px;
          padding: 8px;
          color: var(--text-light);
          cursor: pointer;
          transition: var(--transition);
        }
        .search-btn:hover {
          color: var(--primary);
        }
      `}</style>
    </form>
  )
}

export default SearchBar
