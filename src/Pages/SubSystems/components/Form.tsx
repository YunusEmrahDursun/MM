import React, { useEffect, useState } from 'react'
import { com, Layout, Select } from 'support';
import { toast } from 'react-toastify';

interface propsType{
  afterSaved:Function
  select:any
}
const initialForm = {name:'', system:{name:'',id:''}};

const Form = (props:propsType) => {
  const [form, setForm] = useState<any>(initialForm);
  const [systems, setSystems] = useState([])

  useEffect(() => {
    com.sql({
      type:'selectAll',
      tableName:'systems'
    }).then(res=> setSystems(res.map(i=>({
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
        tableName:'subSystems'
      }).then(i=> {
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }else{
      com.sql({
        type:'insert',
        data:form,
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
      <button className="btn btn-primary" onClick={saveClick}>Kaydet</button>
    </Layout>
  )
}

export default Form
