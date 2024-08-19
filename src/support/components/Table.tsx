import React from 'react'

interface Iheader{
    label:string,
    key:string
}
interface propsType {
    data:any[],
    header:Iheader[]
}
const Table = (props:propsType) => {
    return (
        <>
            {
                props.data.length ? <table className="table">
                    <thead>
                        <tr>
                            {
                                props.header.map((h,index)=> <th key={index} scope="col">{h.label}</th> )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.data.map((r,rIndex)=> <tr key={rIndex}>
                                {
                                    props.header.map((h,hIndex)=> <td key={rIndex+'-'+hIndex}>{r[h.key]}</td> )
                                }
                                </tr>
                            )
                        }
                    </tbody>
                </table> :  <div style={{height:200}} className="row bg-light rounded align-items-center justify-content-center mx-0">
                    <div style={{ border: "2px solid #dddddd",borderRadius:26 }} className="col-md-6 p-3 text-center">
                        Herhangi Bir Kayıt Bulunamadı. Lütfen Ekleyiniz.
                    </div>
                </div>
            }
        </>
    )
}

export default Table
