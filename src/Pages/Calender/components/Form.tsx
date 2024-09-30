import React, { useEffect, useState } from 'react'
import { com, Layout } from 'support';
import { toast } from 'react-toastify';

interface propsType{
  afterSaved:Function
  select:any
}
const initialForm = {name:'', year:'', content:'',data: ''};
let devices:any[] = [];
let subDevices:any[] = []
const Form = (props:propsType) => {
  const [form, setForm] = useState<any>(initialForm);
  const [data, setData] = useState<any>(null);
  const [notFound, setNotFound] = useState<any>([]);

  useEffect(() => {
    Promise.all([
      com.sql({ type: 'selectAll', tableName: 'devices' }),
      com.sql({ type: 'selectAll', tableName: 'subDevices' }),
    ]).then(([devicesRes,subDevicesRes]) => {
      
      devices = devicesRes;
      subDevices = subDevicesRes;
      if(props.select){
        contentChange(props.select, props.select.content);
      }
    }).catch(error => {

    });
  }, [])
  
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

  const contentChange = (item,text) => { 
    const tempForm = {...item};
    tempForm.content = text;
    let a:any = tempForm.content;
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
    const tempDataJson:any[] = [];
    const tempNotFound:any[] = [];
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
        const foundSystem =  devices.find(i=> i.name == sistem ) || { id: '', name: sistem };
        const foundSubSystem =  subDevices.find(i=> i.name == altSistem ) || { id: '', name: altSistem };
        if(foundSystem.id == '' && !tempNotFound.some(i=> i.name == sistem && i.type == 'Cihaz')){
          tempNotFound.push({
            type:'Cihaz',
            name:sistem
          })
        }
        if(foundSubSystem.id == '' && !tempNotFound.some(i=> i.name == altSistem && i.type == 'Alt Cihaz')){
          tempNotFound.push({
            type:'Alt Cihaz',
            name:altSistem,
            sistem:sistem
          })
        }
        tempDataJson.push({
          sistem: foundSystem.name,
          sistemId: foundSystem.id,
          altSistem: foundSubSystem.name,
          altSistemId: foundSubSystem.id,
          period:splitArr[index],
          aylar:dayArr
        })
        tempData.push([sistem,altSistem,splitArr[index]].concat(dayArr))
        
      }
      
    })
    
    if(tempNotFound.length){
      setNotFound(tempNotFound);
    }else{
      tempForm.data = JSON.stringify(tempDataJson);
      setForm(tempForm);
      setData(tempData);
      setNotFound([]);
    }
  }
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
            <textarea className="form-control" value={form.content} onChange={(e)=> contentChange(form, e.target.value)} style={{height:150}}></textarea>
        </div>
       
        <button className="btn btn-primary" onClick={saveClick}>Kaydet</button>
      </Layout>

      {
        notFound.length ? notFound.map((i,index)=> <div key={index} className='btn-danger' style={{padding:5,marginBottom:5}}>
          {i.name} {i.type} Bulunamadı. {i.sistem && `( Üst Cihaz : ${i.sistem})`} <br/> 
        </div> ) : <></>
      }
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
