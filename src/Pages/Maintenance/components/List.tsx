import React, { useEffect, useState } from 'react'
import { com, Table } from 'support';
import moment from "moment";
interface propsType{
  selectItem:Function
}

const List = (props:propsType) => {
    const [data, setData] = useState([]);
    const [sistemler, setSistemler] = useState<null | []>(null);

    useEffect(() => {
      com.sql({ type: 'selectAll', tableName: 'systems' }).then(res=>{
        setSistemler(res);
      })
    }, [])

    useEffect(() => {

      if(props.selectItem && sistemler){

        getData();

      }

    }, [props.selectItem, sistemler])

    const getData = () => {
      com.sql({
        type:'selectAll',
        tableName:'maintenances'
      }).then(res=> setData(res.map(i=>{
        const f:any = sistemler && sistemler.find((s:any)=> s.id == i.sistem );
        return {
          ...i,
          tarih:moment(i.baslangicTarihi).format("DD.MM.YYYY HH:mm"),
          showSistem: (f && f.name) || '',
          button: <div className='float-end'>
            <button type="button" className="btn btn-square btn-outline-primary m-2" onClick={()=> props.selectItem(i)}><i className="fa fa-edit"></i></button>
            <button type="button" className="btn btn-square btn-outline-danger m-2" onClick={()=> deleteClick(i)}><i className="fa fa-trash"></i></button>
          </div>
        }
      })));
    }

    const deleteClick = (item) => {

      com.sql({
        type:'remove',
        tableName:'maintenances',
        where:{id:item.id}
      }).then(res=>{
        getData();
      })


    }

    return (
        <>
            <button  onClick={()=>props.selectItem(null)} type="button" className="float-end btn btn-primary rounded-pill m-2"><i className="fa fa-plus me-2"></i>Ekle</button>
            <Table
                header={
                    [
                        { label:'#',key:'id'},
                        { label:'Kontrol',key:'kontrolNo'},
                        { label:'Sistem',key:'showSistem'},
                        { label:'Tarih',key:'tarih'},
                        { label:'',key:'button'},
                    ]
                }
                data={data}/>
        </>
    )
}

export default List
