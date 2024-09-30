import React, { useEffect, useState } from 'react'
import { com, Layout, Select } from 'support';
import { toast } from 'react-toastify';

interface propsType{
  afterSaved:Function
  select:any
}
const initialForm = {name:'', system:{name:'',id:''}, dokuman:'',stock1:{name:'',id:''}, stock2:{name:'',id:''}, stock3:{name:'',id:''}};

const Form = (props:propsType) => {
  const [form, setForm] = useState<any>(initialForm);
  const [systems, setSystems] = useState([])
  const [stocks, setStocks] = useState([]);

  useEffect(() => {

    Promise.all([
      com.sql({ type: 'selectAll', tableName: 'systems' }),
      com.sql({ type: 'selectAll', tableName: 'stocks' }),
    ]).then(([systemRes, stockRes]) => {
      const tempSystems = systemRes.map(i=>({
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
          system:tempSystems.find(i=> i.id == props.select.systemId) || { id: '' },
          stock1:tempStock.find(i=> i.id == props.select.stock1) || { id: '' },
          stock2:tempStock.find(i=> i.id == props.select.stock2) || { id: '' },
          stock3:tempStock.find(i=> i.id == props.select.stock3) || { id: '' }
        });
      }else{
        
      }
      setStocks(tempStock);
      setSystems(tempSystems);

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
          systemId:form.system.id,
          stock1:form.stock1.id,
          stock2:form.stock2.id,
          stock3:form.stock3.id,
        },
        where:{id:form.id},
        tableName:'subSystems'
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
          systemId:form.system.id,
          stock1:form.stock1.id,
          stock2:form.stock2.id,
          stock3:form.stock3.id,
        },
        tableName:'subSystems'
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
          <label className="form-label">Alt Sistem Adı</label>
          <input className="form-control"  value={form.name} onChange={(e)=> formChange(e,'name')}/>
      </div>
      <div className="mb-3">
        <label className="form-label">Sistem</label>
        <Select placeHolder="Sistem Seçiniz!" values={systems} value={form.system} onChange={(e)=> formChange(e,'system')}/>
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
