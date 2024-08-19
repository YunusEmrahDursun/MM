import React, { useEffect, useState } from 'react'
import { com, Layout } from 'support';
import { toast } from 'react-toastify';

interface propsType{
  afterSaved:Function
  select:any
}
const initialForm = {name:'',
  stokNo:'',
  parcaNo:'',
  miktar:'',
  sarfYeri:'',
  tedarikYeri:'',
  fiyati:''
};

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
        tableName:'stocks'
      }).then(i=> {
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }else{
      com.sql({
        type:'insert',
        data:form,
        tableName:'stocks'
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
      <div className="row">
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Stok Adı</label>
            <input className="form-control" value={form.name} onChange={(e)=> formChange(e,'name')}/>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Stok No</label>
            <input className="form-control" value={form.stokNo} onChange={(e)=> formChange(e,'stokNo')}/>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Parça No</label>
            <input className="form-control" value={form.parcaNo} onChange={(e)=> formChange(e,'parcaNo')}/>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Miktar</label>
            <input className="form-control" value={form.miktar} onChange={(e)=> formChange(e,'miktar')}/>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Sarf Yeri</label>
            <input className="form-control" value={form.sarfYeri} onChange={(e)=> formChange(e,'sarfYeri')}/>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Tedarik Yeri</label>
            <input className="form-control" value={form.tedarikYeri} onChange={(e)=> formChange(e,'tedarikYeri')}/>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Fiyat</label>
            <input className="form-control" value={form.fiyati} onChange={(e)=> formChange(e,'fiyati')}/>
        </div>
      </div>
      <button className="btn btn-primary" onClick={saveClick}>Kaydet</button>
    </Layout>
  )
}

export default Form
