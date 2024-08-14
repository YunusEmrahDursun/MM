import React, { useEffect, useState } from 'react'
import { com, Table } from 'support';

interface propsType{
  selectItem:Function
}

const List = (props:propsType) => {
    const [data, setData] = useState([]);

    useEffect(() => {
      if(props.selectItem){

        com.sql({
            type:'selectAll',
            tableName:'systems'
        }).then(res=> setData(res.map(i=>({
          ...i,
          button: <div className='float-end'>
            <button type="button" className="btn btn-square btn-outline-primary m-2" onClick={()=> props.selectItem(i)}><i className="fa fa-edit"></i></button>
            <button type="button" className="btn btn-square btn-outline-danger m-2"><i className="fa fa-trash"></i></button>
          </div>
        }))));

      }

    }, [props.selectItem])

    return (
        <>
            <button type="button" className="float-end btn btn-primary rounded-pill m-2"><i className="fa fa-plus me-2"></i>Ekle</button>
            <Table
                header={
                    [
                        { label:'#',key:'id'},
                        { label:'Ad',key:'name'},
                        { label:'',key:'button'},
                    ]
                }
                data={data}/>
        </>
    )
}

export default List
