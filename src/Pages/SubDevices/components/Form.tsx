import React, { useEffect, useState } from 'react'
import { com, Layout, Select } from 'support';
import { toast } from 'react-toastify';

interface propsType{
  afterSaved:Function
  select:any
}
const initialForm = {name:'', device:{name:'',id:''}};

const Form = (props:propsType) => {
  const [form, setForm] = useState<any>(initialForm);
  const [devices, setDevices] = useState([])

  useEffect(() => {
    com.sql({
      type:'selectAll',
      tableName:'devices'
    }).then(res=> setDevices(res.map(i=>({
      name:i.name,
      id:i.id
    }))));
  }, [])

  useEffect(() => {
    if(props.select){
      setForm(props.select);
    }
  }, [props.select])

  const saveClick = () => {
    if(form.id){
      com.sql({
        type:'update',
        data:form,
        where:{id:form.id},
        tableName:'subDevices'
      }).then(i=> {
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }else{
      com.sql({
        type:'insert',
        data:form,
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
      <button className="btn btn-primary" onClick={saveClick}>Kaydet</button>
    </Layout>
  )
}

export default Form
