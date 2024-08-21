import React, { useState, useEffect, useRef } from 'react';
import './Select.css'; // CSS dosyanı import et

interface propsType {
  values: any[] | null;
  onChange: Function;
  value: any;
  placeHolder: string;
}

const Select = (props: propsType) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Dropdown'u referansla

  const selectChange = (e) => {
    if (props.values) {
      const obj = { target: { value: null } };
      obj.target.value = props.values.find(i => i.id === e.target.value) || { id: '' };
      props.onChange(obj);
      setIsOpen(false); // Seçim yapıldığında dropdown'ı kapat
    }
  };

  const clearSelection = () => {
    const obj = { target: { value: '' } };
    props.onChange(obj);
    setSearchTerm('');
    setIsOpen(false);
  };

  const filteredValues = props.values
    ? props.values.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  // Dropdown dışında bir yere tıklandığında dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="select-container" ref={dropdownRef}>
      <div className="dropdown">
        <div className="dropdown-hdr">
          <button
            className="dropdown-tggle form-select"
            onClick={() => setIsOpen(!isOpen)}
          >
            {props.value.name || props.placeHolder}
          </button>
          {props.value.id && (
            <button className="clear-button" onClick={clearSelection}>X</button>
          )}
        </div>
        {isOpen && (
          <div className="dropdown-menu show">
            <input
              type="text"
              className="form-control dropdown-search"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredValues.length > 0 ? (
              filteredValues.map((i: any) => (
                <button
                  key={i.id}
                  className="dropdown-item"
                  onClick={() => selectChange({ target: { value: i.id } })}
                >
                  {i.name}
                </button>
              ))
            ) : (
              <button className="dropdown-item disabled">Sonuç bulunamadı</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
