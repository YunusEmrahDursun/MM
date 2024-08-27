import React, { useState } from 'react';

interface IHeader {
    label: string;
    key: string;
    type?: 'date' | 'string' | 'number';
}

interface PropsType {
    data: any[];
    header: IHeader[];
    itemsPerPage?: number;
}

const Table = (props: PropsType) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(props.itemsPerPage || 10);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [openFilter, setOpenFilter] = useState(false);
    const handleFilterChange = (key: string, value: string, type: any) => {
        const temp = { ...filters };
        if (type === 'date') {
            let inputValue = value.replace(/\D/g, '');
            if (inputValue.length > 2) {
                inputValue = inputValue.slice(0, 2) + '.' + inputValue.slice(2);
            }
            if (inputValue.length > 5) {
                inputValue = inputValue.slice(0, 5) + '.' + inputValue.slice(5);
            }
            if (inputValue.length > 10) {
                inputValue = inputValue.slice(0, 10);
            }
            temp[key] = inputValue;
        } else {
            temp[key] = value;
        }
        setFilters(temp);
    };

    const handleClearFilters = () => {
        setFilters({});
    };

    const filteredData = props.data.filter((item) =>
        props.header.every((header) => {
            if (!filters[header.key]) return true;
            if (header.type === 'number') {
                return item[header.key].toString().includes(filters[header.key]);
            } else if (header.type === 'date') {
                return item[header.key].includes(filters[header.key]);
            }
            return item[header.key].toLowerCase().includes(filters[header.key].toLowerCase());
        })
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            {props.data.length ? (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                {props.header.map((h, index) => (
                                      h.key != 'button' && <th key={index} scope="col">
                                          {h.label}
                                      </th>
                                ))}
                                <th>
                                  <button className="btn btn-square btn-outline-primary" onClick={()=> setOpenFilter(!openFilter)}>
                                    <i className="fa fa-filter"></i>
                                  </button>
                                </th>
                            </tr>
                            <tr>
                                {openFilter && props.header.map((h, index) => (
                                  <th key={index}>
                                    {h.type === 'string' && (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={filters[h.key] || ''}
                                            onChange={(e) => handleFilterChange(h.key, e.target.value, h.type)}
                                        />
                                    )}
                                    {h.type === 'number' && (
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={filters[h.key] || ''}
                                            onChange={(e) => handleFilterChange(h.key, e.target.value, h.type)}
                                        />
                                    )}
                                    {h.type === 'date' && (
                                        <input
                                            placeholder="gg.aa.yyyy"
                                            className="form-control"
                                            value={filters[h.key] || ''}
                                            onChange={(e) => handleFilterChange(h.key, e.target.value, h.type)}
                                        />
                                    )}
                                    { h.key == 'button' && <button className="btn btn-square btn-outline-danger ms-3" onClick={handleClearFilters}>
                                      <i className="fa fa-trash"></i>
                                    </button>}
                                  </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((r, rIndex) => (
                                <tr key={rIndex}>
                                    {props.header.map((h, hIndex) => (
                                        <td key={rIndex + '-' + hIndex}>{r[h.key]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button
                            className={'m-1 btn ' + (currentPage === 1 ? 'btn-outline-secondary' : 'btn-outline-primary')}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            {'<'}
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={'m-1 btn ' + (currentPage === index + 1 ? 'active btn btn-info' : 'btn-primary')}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className={'m-1 btn ' + (currentPage === totalPages ? 'btn-outline-secondary' : 'btn-outline-primary')}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            {'>'}
                        </button>
                    </div>
                </>
            ) : (
                <div style={{ height: 200 }} className="row bg-light rounded align-items-center justify-content-center mx-0">
                    <div style={{ border: '2px solid #dddddd', borderRadius: 26 }} className="col-md-6 p-3 text-center">
                        Herhangi Bir Kayıt Bulunamadı. Lütfen Ekleyiniz.
                    </div>
                </div>
            )}
        </>
    );
};

export default Table;
