import React, { useEffect, useState } from 'react'
import { com, Table, Modal, generatePdfBakim } from 'support';
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

    const generateClick = (item) => {
      Promise.all([
        com.sql({ type: 'selectAll', tableName: 'sides' }),
        com.sql({ type: 'selectAll', tableName: 'devices' }),
        com.sql({ type: 'selectAll', tableName: 'periyods' }),
        com.sql({ type: 'selectAll', tableName: 'technicians' }),
        com.sql({ type: 'selectAll', tableName: 'officers' }),
        com.sql({ type: 'selectAll', tableName: 'stocks' }),
        com.sql({ type: 'selectAll', tableName: 'subDevices' }),
      ]).then(([sidesRes, devicesRes, periyodsRes, techniciansRes, officersRes, stocksRes, subDevicesRes]) => {
        let temp;
        if(item){
          temp = {
            ...item,
            birlik: sidesRes.find(i=> i.id == item.birlik ) || { id: '' },
            device: devicesRes.find(i=> i.id == item.device ) || { id: '' },
            subDevice: subDevicesRes.find(i=> i.id == item.subDevice ) || { id: '' },
            personel: techniciansRes.find(i=> i.id == item.personel ) || { id: '' },
            yonetici: officersRes.find(i=> i.id == item.yonetici ) || { id: '' },
            kalite: techniciansRes.find(i=> i.id == item.kalite ) || { id: '' },
            periyod: periyodsRes.find(i=> i.id == item.periyod ) || { id: '' },
            baslangicTarihi:moment(item.baslangicTarihi).format("DD.MM.YYYY"),
            baslangicSaati:moment(item.baslangicTarihi).format("HH:mm"),
            bitisTarihi:moment(item.bitisTarihi).format("DD.MM.YYYY"),
            bitisSaati:moment(item.bitisTarihi).format("HH:mm"),
          }
          try {
            const tempMalzeme = JSON.parse(item.malzemeler).map(m=>{
              const found = stocksRes.find(s=> s.id == m.id)
              return {
                ...m,
                prevGirilenMiktar :m.girilenMiktar,
                miktar: found ? found.miktar : m.miktar
  
              }
            })
            generatePdfBakim({
              birlikAdi:temp.birlik.name,
              sistemAdi:temp.device.name,
              subSistemAdi:temp.subDevice.name,
              kontrolNo:temp.kontrolNo,
        
              baslangicTarihi:temp.baslangicTarihi,
              baslangicSaati:temp.baslangicSaati,
              bitisTarihi:temp.bitisTarihi,
              bitisSaati:temp.bitisSaati,
        
              aciklama:temp.aciklama,
              dokuman:temp.dokuman,
              periyod:temp.periyod.name,
              personel:temp.personel.name,
              yonetici:temp.yonetici.name,
              kalite:temp.kalite.name,
              personelKase:temp.personel.title,
              yoneticiKase:temp.yonetici.title,
              kaliteKase:temp.kalite.title,

              malzemeler:tempMalzeme
            })
          } catch (error) {
  
          }
        }
  
      }).catch(error => {
  
      });
    }

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
            <button type="button" className="btn btn-square btn-outline-primary m-2" onClick={()=> props.selectItem({...i, id: null })}><i className="fa fa-copy"></i></button>
            <button type="button" className="btn btn-square btn-outline-primary m-2" onClick={()=> props.selectItem(i)}><i className="fa fa-edit"></i></button>
            <button type="button" className="btn btn-square btn-outline-primary m-2" onClick={()=> generateClick(i)}><i className="fa fa-print"></i></button>
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
          type:'setDeleted',
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
