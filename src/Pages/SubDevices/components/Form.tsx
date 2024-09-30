import React, { useEffect, useState } from 'react'
import { com, Layout, Select } from 'support';
import { toast } from 'react-toastify';

interface propsType{
  afterSaved:Function
  select:any
}
const initialForm = {name:'', device:{name:'',id:''}, dokuman:'',stock1:{name:'',id:''}, stock2:{name:'',id:''}, stock3:{name:'',id:''} };

const Form = (props:propsType) => {
  const [form, setForm] = useState<any>(initialForm);
  const [devices, setDevices] = useState([]);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    Promise.all([
      com.sql({ type: 'selectAll', tableName: 'devices' }),
      com.sql({ type: 'selectAll', tableName: 'stocks' }),
    ]).then(([devicesRes, stockRes]) => {
      const tempDevices = devicesRes.map(i=>({
        name:i.name,
        id:i.id
      }))
      const tempStock = stockRes.map(i=>({
        name:i.name,
        id:i.id
      }))

      if(props.select){
        setForm({
          ...props.select,
          device:tempDevices.find(i=> i.id == props.select.deviceId) || { id: '' },
          stock1:tempStock.find(i=> i.id == props.select.stock1) || { id: '' },
          stock2:tempStock.find(i=> i.id == props.select.stock2) || { id: '' },
          stock3:tempStock.find(i=> i.id == props.select.stock3) || { id: '' }
        });
      }else{
        
      }
      setStocks(tempStock);
      setDevices(tempDevices);

    }).catch(error => {

    });
    
  }, [])

  

  const saveClick = () => {
    if(form.id){
      com.sql({
        type:'update',
        data:{
          name:form.name,
          dokuman:form.dokuman,
          deviceId:form.device.id,
          stock1:form.stock1.id,
          stock2:form.stock2.id,
          stock3:form.stock3.id,
        },
        where:{id:form.id},
        tableName:'subDevices'
      }).then(i=> {
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }else{
      com.sql({
        type:'insert',
        data:{
          name:form.name,
          dokuman:form.dokuman,
          deviceId:form.device.id,
          stock1:form.stock1.id,
          stock2:form.stock2.id,
          stock3:form.stock3.id,
        },
        tableName:'subDevices'
      }).then(i=> {
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }

  }

  const formChange = (e, key) => {
    setForm({...form, [key]:e.target.value})
  }

  return (
    <Layout>
      <div className="mb-3">
          <label className="form-label">Alt Cihaz Adı</label>
          <input className="form-control"  value={form.name} onChange={(e)=> formChange(e,'name')}/>
      </div>
      <div className="mb-3">
        <label className="form-label">Cihaz</label>
        <Select placeHolder="Cihaz Seçiniz!" values={devices} value={form.device} onChange={(e)=> formChange(e,'device')}/>
      </div>
      <div className="mb-3">
          <label className="form-label">Döküman</label>
          <input className="form-control"  value={form.dokuman} onChange={(e)=> formChange(e,'dokuman')}/>
      </div>
      <div className="mb-3">
        <label className="form-label">Stok1</label>
        <Select placeHolder="Malzeme Seçiniz!" values={stocks} value={form.stock1} onChange={(e)=> formChange(e,'stock1')}/>
      </div>
      <div className="mb-3">
        <label className="form-label">Stok2</label>
        <Select placeHolder="Malzeme Seçiniz!" values={stocks} value={form.stock2} onChange={(e)=> formChange(e,'stock2')}/>
      </div>
      <div className="mb-3">
        <label className="form-label">Stok3</label>
        <Select placeHolder="Malzeme Seçiniz!" values={stocks} value={form.stock3} onChange={(e)=> formChange(e,'stock3')}/>
      </div>
      <button className="btn btn-primary" onClick={saveClick}>Kaydet</button>
    </Layout>
  )
}

export default Form
