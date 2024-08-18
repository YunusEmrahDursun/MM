import { useEffect, useState } from "react";
import { com, Layout } from "support";
import { generatePdfBakim } from "./components/generator";

import { toast } from 'react-toastify';

const initialForm = {
  name:'',
  birlik:{name:'', id:0},
  sistem:{name:'', id:0, shortName:''},
  periyod:{name:'', id:0},
  kontrolNo:'',
  baslangicTarihi:'',
  baslangicSaati:'',
  bitisTarihi:'',
  bitisSaati:'',
  dokuman:'',
  aciklama:'',
  personel:{name:'', id:0},
  yonetici:{name:'', id:0},
};
function Maintenance() {
  const [form, setForm] = useState(initialForm);
  const [birlikler, setBirlikler] = useState([]);
  const [sistemler, setSistemler] = useState([]);
  const [periyotlar, setPeriyotlar] = useState([]);

  useEffect(() => {
     getData();
  }, [])

  const getData = () => {
    com.sql({ type:'selectAll', tableName:'sides' }).then(res=> {
      if(res.length == 1){
        setForm(prev=> ({...prev,birlikId:res[0]}))
      }
      setBirlikler(res)
    });
    com.sql({ type:'selectAll', tableName:'systems' }).then(res=> { setSistemler(res) });
    com.sql({ type:'selectAll', tableName:'periyods' }).then(res=> { setPeriyotlar(res) });
  }

  const generateClick = () => {
    console.log(form)
    generatePdfBakim({
      birlikAdi:form.birlik.name,
      sistemAdi:form.sistem.name,
      bolgeKodu:form.sistem.shortName,
      kontrolNo:form.kontrolNo,

      baslangicTarihi:form.baslangicTarihi,
      baslangicSaati:form.baslangicSaati,
      bitisTarihi:form.bitisTarihi,
      bitisSaati:form.bitisSaati,

      aciklama:form.aciklama,
      dokuman:form.dokuman,
      periyod:form.periyod.name,
      personel:form.personel.name,
      yonetici:form.yonetici.name,


      malzemeler:""
    })
  }
  const saveClick = () => {
    // com.sql({
    //   type:'insert',
    //   data:form,
    //   tableName:'systems'
    // }).then(i=> {
    //   toast("Kaydedildi!")
    // })
  }
  const formChange = (e, key) => {
    setForm({...form, [key]:e.target.value})
  }
  return (
    <Layout title="Rapor Oluştur">
      <div className="row mb3">
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Birlik Adı</label>
            <select className="form-select " aria-label="Seçiniz" value={form.birlik.id} onChange={(e)=> formChange(e,'birlik')}>
              <option>Birlik Seçiniz!</option>
              {
                birlikler.map((i:any)=> <option key={i.id} value={i.id} >{i.name}</option>)
              }
            </select>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Sistem Adı</label>
            <select className="form-select" aria-label="Seçiniz" value={form.sistem.id} onChange={(e)=> formChange(e,'sistem')}>
              <option>Sistem Seçiniz!</option>
              {
                sistemler.map((i:any)=> <option key={i.id} value={i.id} >{i.name}</option>)
              }
            </select>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Kontrol No</label>
            <input className="form-control"  value={form.kontrolNo} onChange={(e)=> formChange(e,'kontrolNo')}/>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
        <label className="form-label">Periyod</label>
            <select className="form-select" aria-label="Seçiniz" value={form.periyod.id} onChange={(e)=> formChange(e,'periyod')}>
              <option>Periyod Seçiniz!</option>
              {
                periyotlar.map((i:any)=> <option key={i.id} value={i.id} >{i.name}</option>)
              }
            </select>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6 col-xl-3 mb-3">
            <label className="form-label">Başlangıç Tarihi</label>
            <input className="form-control"  value={form.baslangicTarihi} onChange={(e)=> formChange(e,'baslangicTarihi')}/>
        </div>
        <div className="col-sm-6 col-xl-3 mb-3">
            <label className="form-label">Başlangıç Saati</label>
            <input className="form-control"  value={form.baslangicSaati} onChange={(e)=> formChange(e,'baslangicSaati')}/>
        </div>
        <div className="col-sm-6 col-xl-3 mb-3">
            <label className="form-label">Bitiş Tarihi</label>
            <input className="form-control"  value={form.bitisTarihi} onChange={(e)=> formChange(e,'bitisTarihi')}/>
        </div>
        <div className="col-sm-6 col-xl-3 mb-3">
            <label className="form-label">Bitiş Saati</label>
            <input className="form-control"  value={form.bitisSaati} onChange={(e)=> formChange(e,'bitisSaati')}/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12 col-xl-12 mb-3">
            <label className="form-label">Döküman</label>
            <textarea className="form-control"  value={form.dokuman} onChange={(e)=> formChange(e,'dokuman')}/>
        </div>
        <div className="col-sm-12 col-xl-12 mb-3">
            <label className="form-label">Döküman</label>
            <textarea className="form-control"  value={form.dokuman} onChange={(e)=> formChange(e,'dokuman')}/>
        </div>
        <div className="col-sm-12 col-xl-12 mb-3">
            <label className="form-label">Yapılan Çalışma</label>
            <textarea className="form-control"  value={form.aciklama} onChange={(e)=> formChange(e,'aciklama')}/>
        </div>

      </div>

      <div>
        <button className="btn btn-primary " onClick={saveClick}>Kaydet</button>
        <button className="btn btn-success ms-3" onClick={generateClick}>Rapor Oluştur</button>
      </div>

    </Layout>
  )
}

export default Maintenance;
