import React, { useState, useEffect, useRef } from 'react';
import './Select.css';

interface propsType {
  values: any[] | null;
  onChange: Function;
  value: any;
  placeHolder: string;
}

const Select = (props: propsType) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectChange = (e) => {
    if (props.values) {
      const obj = { target: { value: null } };
      obj.target.value = props.values.find(i => i.id === e.target.value) || { id: '' };
      props.onChange(obj);
      setIsOpen(false);
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
      <div className="select-dropdown">
        <div className="select-dropdown-header">
          <button
            className="select-dropdown-toggle form-select"
            onClick={() => setIsOpen(!isOpen)}
          >
            {props.value.name || props.placeHolder}
          </button>
          {props.value.id && (
            <button className="clear-button" onClick={clearSelection}>X</button>
          )}
        </div>
        {isOpen && (
          <div className="select-dropdown-menu dropdown-menu show">
            <input
              type="text"
              className="form-control select-dropdown-search"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredValues.length > 0 ? (
              filteredValues.map((i: any) => (
                <button
                  key={i.id}
                  className="select-dropdown-item dropdown-item"
                  onClick={() => selectChange({ target: { value: i.id } })}
                >
                  {i.name}
                </button>
              ))
            ) : (
              <button className="select-dropdown-item dropdown-item disabled">Sonuç bulunamadı</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
