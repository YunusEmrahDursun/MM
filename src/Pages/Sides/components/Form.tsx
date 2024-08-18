import React, { useEffect, useState } from 'react'
import { com, Layout } from 'support';
import { toast } from 'react-toastify';

interface propsType{
  afterSaved:Function
  select:any
}
const initialForm = {name:'', shortName:''};

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
        tableName:'sides'
      }).then(i=> {
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }else{
      com.sql({
        type:'insert',
        data:form,
        tableName:'sides'
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
          <label className="form-label">Birlik Adı</label>
          <input className="form-control"  value={form.name} onChange={(e)=> formChange(e,'name')}/>
      </div>
      <div className="mb-3">
          <label className="form-label">Birlik Kodu</label>
          <input className="form-control"  value={form.shortName} onChange={(e)=> formChange(e,'shortName')}/>
      </div>
      <button className="btn btn-primary" onClick={saveClick}>Kaydet</button>
    </Layout>
  )
}

export default Form
