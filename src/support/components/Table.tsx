import React, { useState } from 'react';

interface IHeader {
    label: string;
    key: string;
}

interface PropsType {
    data: any[];
    header: IHeader[];
    itemsPerPage?: number;
}

const Table = (props: PropsType) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(props.itemsPerPage || 10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = props.data.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(props.data.length / itemsPerPage);

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
                                    <th key={index} scope="col">
                                        {h.label}
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
                        <button className={'m-1 btn  ' + ( currentPage === totalPages ? 'btn-outline-secondary' : 'btn-outline-primary')}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                          {'<'}
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={ 'm-1 btn '+ (currentPage === index + 1 ? 'active btn btn-info' : 'btn-primary')}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button className={'m-1 btn  ' + ( currentPage === totalPages ? 'btn-outline-secondary' : 'btn-outline-primary')}
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
