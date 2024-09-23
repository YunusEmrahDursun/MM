import React, { useEffect, useState } from 'react'
import { com, Layout } from 'support';
import { toast } from 'react-toastify';

interface propsType{
  afterSaved:Function
  select:any
}
const initialForm = {name:'', year:'', content:''};

const Form = (props:propsType) => {
  const [form, setForm] = useState<any>(initialForm);
  const [data, setData] = useState<any>(null);
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
        tableName:'calender'
      }).then(i=> {
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }else{
      com.sql({
        type:'insert',
        data:form,
        tableName:'calender'
      }).then(i=> {
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }

  }

  const formChange = (e, key) => {
    setForm({...form, [key]:e.target.value})
  }

  useEffect(() => {
    if(form.content){
      let a:any = form.content;
      a = a.replace(/CİHAZ.*ARALIK/,'').replace(/((-|\d)*)\nHaftası/g, (m, s1)=>{
        return '#' + s1 + '#';
      }).replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t');
      const regex = /\\n(.*?)\\t/gm;
      let matches = [...a.matchAll(regex).filter(i=> i[0]!= '\\n\\t')];

      let result = [];

      for (let i = 0; i < matches.length - 1; i++) {
        const start = matches[i].index;
        const end = matches[i + 1].index;
        //@ts-ignore
        result.push(a.slice(start, end));
      }

      if (matches.length > 0) {
        //@ts-ignore
        result.push(a.slice(matches[matches.length - 1].index));
      }
      const tempData:any[] = [];
      result.forEach((i:string)=> {
        let sistem = '', altSistem = '';

        let str = i;
        str = str.replace(/\\n(.*?)\\t/,(m,s1:any)=> {
          const sistemArr = s1.split('-');
          sistem = sistemArr[0].trim();
          altSistem = sistemArr[1]?.trim() || '';
          return ''
        })
        let splitArr = str.split(/(\d{0,1}\s{0,1}[A-Z]+)/gm).filter(Boolean);
        for (let index = 0; index < splitArr.length; index+=2) {
          let dayArr = splitArr[index+1].replace('\\t','').replace('\\n\\t','').split('\\t');

          tempData.push([sistem,altSistem,splitArr[index]].concat(dayArr))
          
        }
        
      })
      console.log(tempData)
      setData(tempData)
    }
  }, [form.content])
  
  return ( <>
      <Layout>
        <div className="row">
          <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Adı</label>
            <input className="form-control"  value={form.name} onChange={(e)=> formChange(e,'name')}/>
          </div>
          <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Yıl</label>
            <input className="form-control"  value={form.year} onChange={(e)=> formChange(e,'year')}/>
          </div>
        </div>

        <div className="mb-3">
            <label className="form-label">İçerik</label>
            <textarea className="form-control" value={form.content} onChange={(e)=> formChange(e,'content')} style={{height:150}}></textarea>
        </div>
       
        <button className="btn btn-primary" onClick={saveClick}>Kaydet</button>
      </Layout>

      { data && <Layout>
        <table className="table">
            <thead>
                <tr>
                  <th scope="col">Sistem</th>
                  <th scope="col">Alt Sistem</th>
                  <th scope="col">Periyot</th>
                  <th scope="col">Ocak</th>
                  <th scope="col">Şubat</th>
                  <th scope="col">Mart</th>
                  <th scope="col">Nisan</th>
                  <th scope="col">Mayıs</th>
                  <th scope="col">Haziran</th>
                  <th scope="col">Temmuz</th>
                  <th scope="col">Ağustos</th>
                  <th scope="col">Eylül</th>
                  <th scope="col">Ekim</th>
                  <th scope="col">Kasım</th>
                  <th scope="col">Aralık</th>
                </tr>
            </thead>
            <tbody>
                { data.map((row,rowIndex)=> 
                  <tr key={rowIndex}>
                    {
                      row.map((col,colIndex)=> <th key={rowIndex + '-' + colIndex}>{col}</th>)
                    }
                  </tr>
                )}
                
            </tbody>
        </table>
      </Layout>}
    </>
  )
}

export default Form
