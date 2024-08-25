import React, { useEffect, useState } from 'react'
import { com, Table, Modal } from 'support';
import moment from "moment";
interface propsType{
  selectItem:Function
}

const List = (props:propsType) => {
    const [data, setData] = useState([]);
    const [sistemler, setSistemler] = useState<null | []>(null);
    const [showModal, setShowModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
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
            <button type="button" className="btn btn-square btn-outline-danger m-2" onClick={()=> handleDeleteClick(i)}><i className="fa fa-trash"></i></button>
          </div>
        }
      })));
    }
    const handleDeleteClick = (item) => {
      setItemToDelete(item);
      setShowModal(true);
    };
    const handleConfirmDelete = () => {
      if (itemToDelete){
        com.sql({
          type:'remove',
          tableName:'maintenances',
          where:{id:itemToDelete.id}
        }).then(res=>{
          setShowModal(false);
          setItemToDelete(null);
          getData();
        })
      }
    }
    const handleCloseModal = () => {
      setShowModal(false);
      setItemToDelete(null);
    };
    return (
        <>
            <button  onClick={()=>props.selectItem(null)} type="button" className="float-end btn btn-primary rounded-pill m-2"><i className="fa fa-plus me-2"></i>Ekle</button>
            <Table
                header={
                    [
                        { label:'#',key:'id',type:'number'},
                        { label:'Kontrol',key:'kontrolNo',type:'string'},
                        { label:'Sistem',key:'showSistem',type:'string'},
                        { label:'Tarih',key:'tarih',type:'date'},
                        { label:'',key:'button'},
                    ]
                }
                data={data}/>
            <Modal
              show={showModal}
              onClose={handleCloseModal}
              onConfirm={handleConfirmDelete}
              title="Silme Onayı"
              message="Bu öğeyi silmek istediğinize emin misiniz?"
            />
        </>
    )
}

export default List
