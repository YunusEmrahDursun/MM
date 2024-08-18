import React, { useEffect, useState } from 'react'
import { com, Layout } from 'support';
import { toast } from 'react-toastify';

interface propsType{
  afterSaved:Function
  select:any
}
const initialForm = {name:'', title:''};

const Form = (props:propsType) => {
  const [form, setForm] = useState<any>(initialForm);

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
        tableName:'technicians'
      }).then(i=> {
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }else{
      com.sql({
        type:'insert',
        data:form,
        tableName:'technicians'
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
          <label className="form-label">Teknisyen Adı</label>
          <input className="form-control"  value={form.name} onChange={(e)=> formChange(e,'name')}/>
      </div>
      <div className="mb-3">
          <label className="form-label">Teknisyen Kaşe</label>
          <input className="form-control"  value={form.title} onChange={(e)=> formChange(e,'title')}/>
      </div>
      <button className="btn btn-primary" onClick={saveClick}>Kaydet</button>
    </Layout>
  )
}

export default Form
