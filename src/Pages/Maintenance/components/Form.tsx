import { useEffect, useState } from "react";
import { com, Layout, Select, generatePdfBakim } from "support";
import { toast } from 'react-toastify';
import moment from "moment";
import { useLocation } from "react-router-dom";
const initialForm = {
  name:'',
  birlik:{name:'', id:'', shortName:''},
  device:{name:'', id:''},
  subDevice:{name:'', id:''},
  periyod:{name:'', id:''},
  kontrolNo:'',
  baslangicTarihi: moment().format('DD.MM.YYYY'),
  baslangicSaati:'',
  bitisTarihi: moment().format('DD.MM.YYYY'),
  bitisSaati:'',
  dokuman:'',
  aciklama:'',
  personel:{name:'', id:'', title:''},
  yonetici:{name:'', id:'', title:''},
  kalite:{name:'', id:'', title:''},
  malzemeler:[]
};
interface propsType{
  afterSaved:Function
  select:any
}
function Form(props:propsType) {
  
  const [form, setForm] = useState<any>(initialForm);
  const [birlikler, setBirlikler] = useState<null | []>(null);
  const [devices, setDevices] = useState<null | []>(null);
  const [subDevices, setSubDevices] = useState< any>([]);
  const [showSubDevices, setShowSubDevices] = useState<[]>([]);
  const [periyotlar, setPeriyotlar] = useState<null | []>(null);
  const [teknisyenler, setTeknisyenler] = useState<null | []>(null);
  const [yoneticiler, setYoneticiler] = useState<null | []>(null);
  const [malzemeler, setMalzemeler] = useState<null | []>(null);
  const [selectedMalzeme, setSelectedMalzeme] = useState<any>(null);
  const [malzemeList, setMalzemeList] = useState<any[]>([]);
  const [tempMalzemeList, setTempMalzemeList] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Promise.all([
      com.sql({ type: 'selectAll', tableName: 'sides' }),
      com.sql({ type: 'selectAll', tableName: 'devices' }),
      com.sql({ type: 'selectAll', tableName: 'periyods' }),
      com.sql({ type: 'selectAll', tableName: 'technicians' }),
      com.sql({ type: 'selectAll', tableName: 'officers' }),
      com.sql({ type: 'selectAll', tableName: 'stocks' }),
      com.sql({ type: 'selectAll', tableName: 'subDevices' }),
    ]).then(([sidesRes, devicesRes, periyodsRes, techniciansRes, officersRes, stocksRes,subDevicesRes]) => {
      let temp;
      if(props.select){
        temp = {
          ...props.select,
          birlik: sidesRes.find(i=> i.id == props.select.birlik ) || { id: '' },
          device: devicesRes.find(i=> i.id == props.select.device ) || { id: '' },
          subDevice: subDevicesRes.find(i=> i.id == props.select.subDevice ) || { id: '' },
          personel: techniciansRes.find(i=> i.id == props.select.personel ) || { id: '' },
          kalite: techniciansRes.find(i=> i.id == props.select.kalite ) || { id: '' },
          yonetici: officersRes.find(i=> i.id == props.select.yonetici ) || { id: '' },
          periyod: periyodsRes.find(i=> i.id == props.select.periyod ) || { id: '' },
          baslangicTarihi:moment(props.select.baslangicTarihi).format("DD.MM.YYYY"),
          baslangicSaati:moment(props.select.baslangicTarihi).format("HH:mm"),
          bitisTarihi:moment(props.select.bitisTarihi).format("DD.MM.YYYY"),
          bitisSaati:moment(props.select.bitisTarihi).format("HH:mm"),
        }
        try {
          const tempMalzeme = JSON.parse(props.select.malzemeler).map(m=>{
            const found = stocksRes.find(s=> s.id == m.id)
            return {
              ...m,
              prevGirilenMiktar :m.girilenMiktar,
              miktar: found ? found.miktar : m.miktar

            }
          })
          setShowSubDevices(subDevicesRes.filter(i=> i.deviceId == props.select.device ))
          setMalzemeList(tempMalzeme);
          setTempMalzemeList(tempMalzeme);
        } catch (error) {

        }
      }else if(location.state){
        const item:any = location.state;
        console.log(item)
        temp = {...initialForm};

        if (sidesRes.length === 1) {
          temp.birlik = sidesRes[0];
          temp.kontrolNo = sidesRes[0].shortName + '-' + moment().format('YYMMDD');
        }
        if (techniciansRes.length === 1) {
          temp.personel = techniciansRes[0]
        }
        if (officersRes.length === 1) {
          temp.yonetici = officersRes[0]
        }
        temp.baslangicTarihi = moment(item.start).format('DD.MM.YYYY');
        temp.bitisTarihi = moment(item.end).format('DD.MM.YYYY');
        temp.periyod = periyodsRes.find(i=> i.name == item.period ) || { id: '' };

        temp.device = devicesRes.find(i=> i.id == item.sistemId ) || { id: '' };
        temp.subDevice = subDevicesRes.find(i=> i.id == item.altSistemId ) || { id: '' };
        temp.dokuman = subDevicesRes.find(i=> i.id == item.altSistemId )?.dokuman || '';

      }else{
        temp = {...initialForm};

        if (sidesRes.length === 1) {
          temp.birlik = sidesRes[0];
          temp.kontrolNo = sidesRes[0].shortName + '-' + moment().format('YYMMDD');
        }
        if (techniciansRes.length === 1) {
          temp.personel = techniciansRes[0]
        }
        if (officersRes.length === 1) {
          temp.yonetici = officersRes[0]
        }
        setShowSubDevices(subDevicesRes)
      }

      setBirlikler(sidesRes);
      setDevices(devicesRes);
      setSubDevices(subDevicesRes);
      setPeriyotlar(periyodsRes);
      setTeknisyenler(techniciansRes);
      setYoneticiler(officersRes);
      setMalzemeler(stocksRes);
      setForm(temp);

    }).catch(error => {

    });


  }

  const generateClick = () => {
    generatePdfBakim({
      birlikAdi:form.birlik.name,
      sistemAdi:form.device.name,
      subSistemAdi:form.subDevice.name,
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
      kalite:form.kalite.name,
      personelKase:form.personel.title,
      yoneticiKase:form.yonetici.title,
      kaliteKase:form.kalite.title,
      malzemeler:malzemeList
    })
  }
  const saveClick = () => {
    if(form.id){
      com.sql({
        type:'update',
        where:{id:form.id},
        data:{
          kontrolNo:form.kontrolNo,
          birlik:form.birlik.id,
          device:form.device.id,
          subDevice:form.subDevice.id,
          personel:form.personel.id,
          yonetici:form.yonetici.id,
          kalite:form.kalite.id,
          periyod:form.periyod.id,
          aciklama:form.aciklama,
          dokuman:form.dokuman,
          baslangicTarihi:moment(form.baslangicTarihi+'/'+form.baslangicSaati, "DD.MM.YYYY/HH:mm").valueOf(),
          bitisTarihi:moment(form.bitisTarihi+'/'+form.bitisSaati, "DD.MM.YYYY/HH:mm").valueOf(),
          malzemeler:JSON.stringify(malzemeList)
        },
        tableName:'maintenances'
      }).then(i=> {

        malzemeList.forEach((yeniMalzeme) => {
          try {
            if(malzemeler){

              const eskiMalzeme:any = malzemeler.find((malzeme:any) => malzeme.id === yeniMalzeme.id);
              if (eskiMalzeme) {

                const gm = parseInt(yeniMalzeme.girilenMiktar);
                const pm = parseInt(yeniMalzeme.prevGirilenMiktar);
                const m = parseInt(eskiMalzeme.miktar);

                if( !isNaN(gm) && !isNaN(pm) && !isNaN(m) ){
                  const mf = gm - pm;
                  com.sql({ 
                    data: { miktar: m - mf }, type: 'update',where: { id: yeniMalzeme.id },tableName: 'stocks' }).catch(error => {});
                }else if(isNaN(gm) && !isNaN(pm) && !isNaN(m) ){
                  com.sql({
                    type: 'update',
                    where: { id: yeniMalzeme.id },
                    data: { miktar: m + pm },
                    tableName: 'stocks'
                  }).catch(error => {});
                }else if(isNaN(pm) && !isNaN(gm) && !isNaN(m)){
                  com.sql({
                    type: 'update',
                    where: { id: yeniMalzeme.id },
                    data: { miktar: m - gm },
                    tableName: 'stocks'
                  }).catch(error => {});
                }
               
              }
            }
          } catch (error) {}

        });

        tempMalzemeList.forEach(t=>{
          if( !malzemeList.some(m=> m.id == t.id ) ){
            try {
              if(!isNaN(parseInt(t.girilenMiktar)) && !isNaN(parseInt(t.miktar))){
                com.sql({
                  type: 'update',
                  where: { id: t.id },
                  data: { miktar: parseInt(t.girilenMiktar) + parseInt(t.miktar) },
                  tableName: 'stocks'
                }).catch(error => {
                });
              }
              
            } catch (error) {

            }
          }
        })

        props.afterSaved();
        toast("Kaydedildi!")
      })
    }else{
      com.sql({
        type:'insert',
        data:{
          kontrolNo:form.kontrolNo,
          birlik:form.birlik.id,
          device:form.device.id,
          subDevice:form.subDevice.id,
          personel:form.personel.id,
          yonetici:form.yonetici.id,
          kalite:form.kalite.id,
          periyod:form.periyod.id,
          aciklama:form.aciklama,
          dokuman:form.dokuman,
          baslangicTarihi:moment(form.baslangicTarihi+'/'+form.baslangicSaati, "DD.MM.YYYY/HH:mm").valueOf(),
          bitisTarihi:moment(form.bitisTarihi+'/'+form.bitisSaati, "DD.MM.YYYY/HH:mm").valueOf(),
          malzemeler:JSON.stringify(malzemeList)
        },
        tableName:'maintenances'
      }).then(i=> {
        malzemeList.forEach(malzeme=> {
          try {
            const newMiktar = parseInt(malzeme.miktar) - parseInt(malzeme.girilenMiktar);
            if(!isNaN(newMiktar)){
              com.sql({type:'update',where:{id:malzeme.id},data:{miktar:newMiktar},tableName:'stocks'})

            }
          } catch (error) { }
        })
        props.afterSaved();
        toast("Kaydedildi!")
      })
    }

  }
  const formChange = (e, key) => {
    const temp = {...form};
    if(key == 'device'){
      if(e.target.value.id){
        setShowSubDevices(subDevices.filter(i=> i.id == e.target.value.id))
      }
      else{
        temp.subDevice = {id:''}
        setShowSubDevices(subDevices)
      }
      temp[key] = e.target.value;
    }
    else if(key == 'birlik'){
      if(e.target.value.shortName){
        temp.kontrolNo = e.target.value.shortName + '-' + moment().format('YYMMDD') || '';
      }else{
        temp.kontrolNo = '';
      }

      temp[key] = e.target.value;
    }
    else if(key == 'baslangicTarihi' || key == 'bitisTarihi'){
      let inputValue = e.target.value.replace(/\D/g, '');
      if (inputValue.length > 2) {
        inputValue = inputValue.slice(0, 2) + '.' + inputValue.slice(2);
      }
      if (inputValue.length > 5) {
        inputValue = inputValue.slice(0, 5) + '.' + inputValue.slice(5);
      }
      if (inputValue.length > 10) {
        inputValue = inputValue.slice(0, 10);
      }
      if(inputValue.length == 10){
        if(key == 'baslangicTarihi' && temp.bitisTarihi == '' ){
          temp.bitisTarihi = inputValue;
        }
      }
      temp[key] = inputValue;
    }else if(key == 'baslangicSaati' || key == 'bitisSaati'){
      let inputValue = e.target.value.replace(/\D/g, '');
      if (inputValue.length > 2) {
        inputValue = inputValue.slice(0, 2) + ':' + inputValue.slice(2);
      }
      if (inputValue.length > 5) {
        inputValue = inputValue.slice(0, 5);
      }
      temp[key] = inputValue;
    }
    else{
      temp[key] = e.target.value;
    }

    setForm(temp);

  }

  const malzemeEkle = () => {
    if (malzemeList.length >= 3) {
      setErrorMessage('Maksimum 3 malzeme seçebilirsiniz.');
      return;
    }

    if (selectedMalzeme) {
      const isAlreadyInList = malzemeList.some(malzeme => malzeme.id === selectedMalzeme.id);

      if (isAlreadyInList) {
        setErrorMessage('Bu malzeme zaten eklendi.');
      } else {
        setMalzemeList([...malzemeList, {...selectedMalzeme, girilenMiktar:'' }]);
        setSelectedMalzeme(null);
        setErrorMessage('');
      }
    }
  };

  const malzemeSil = (id) => {
    setMalzemeList(malzemeList.filter((malzeme:any) => malzeme.id !== id));
  };

  const malzemeMiktarChange = (e,index) => {
    const temp = [...malzemeList];
    malzemeList[index].girilenMiktar = e.target.value;
    setMalzemeList(temp)

  }
  return (
    <Layout>
      <div className="row">
        <div className="col-sm-12 col-xl-4 mb-3">
            <label className="form-label">Birlik Adı</label>
            <Select placeHolder="Birlik Seçiniz!" values={birlikler} value={form.birlik} onChange={(e)=> formChange(e,'birlik')}/>
        </div>
        <div className="col-sm-12 col-xl-4 mb-3">
            <label className="form-label">Cihaz Adı</label>
            <Select placeHolder="Cihaz Seçiniz!" values={devices} value={form.device} onChange={(e)=> formChange(e,'device')}/>
        </div>
        <div className="col-sm-12 col-xl-4 mb-3">
            <label className="form-label">Alt Cihaz Adı</label>
            <Select placeHolder="Alt Cihaz Seçiniz!" values={showSubDevices} value={form.subDevice} onChange={(e)=> formChange(e,'subDevice')}/>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
            <label className="form-label">Kontrol No</label>
            <input className="form-control"  value={form.kontrolNo} onChange={(e)=> formChange(e,'kontrolNo')}/>
        </div>
        <div className="col-sm-12 col-xl-6 mb-3">
          <label className="form-label">Periyod</label>
          <Select placeHolder="Periyod Seçiniz!" values={periyotlar} value={form.periyod} onChange={(e)=> formChange(e,'periyod')}/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6 col-xl-3 mb-3">
            <label className="form-label">Başlangıç Tarihi</label>
            <input placeholder="gg.aa.yyyy" className="form-control"  value={form.baslangicTarihi} onChange={(e)=> formChange(e,'baslangicTarihi')}/>
        </div>
        <div className="col-sm-6 col-xl-3 mb-3">
            <label className="form-label">Başlangıç Saati</label>
            <input placeholder="ss:dd" className="form-control"  value={form.baslangicSaati} onChange={(e)=> formChange(e,'baslangicSaati')}/>
        </div>
        <div className="col-sm-6 col-xl-3 mb-3">
            <label className="form-label">Bitiş Tarihi</label>
            <input placeholder="gg.aa.yyyy" className="form-control"  value={form.bitisTarihi} onChange={(e)=> formChange(e,'bitisTarihi')}/>
        </div>
        <div className="col-sm-6 col-xl-3 mb-3">
            <label className="form-label">Bitiş Saati</label>
            <input placeholder="ss:dd" className="form-control"  value={form.bitisSaati} onChange={(e)=> formChange(e,'bitisSaati')}/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12 col-xl-12 mb-3">
            <label className="form-label">Döküman</label>
            <textarea className="form-control"  value={form.dokuman} onChange={(e)=> formChange(e,'dokuman')}/>
        </div>
        <div className="col-sm-12 col-xl-12 mb-3">
            <label className="form-label">Yapılan Çalışma</label>
            <textarea className="form-control"  value={form.aciklama} onChange={(e)=> formChange(e,'aciklama')}/>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12 col-xl-4 mb-3">
            <label className="form-label">Personel</label>
            <Select placeHolder="Personel Seçiniz!" values={teknisyenler} value={form.personel} onChange={(e)=> formChange(e,'personel')}/>
        </div>
        <div className="col-sm-12 col-xl-4 mb-3">
            <label className="form-label">Kalite Personeli</label>
            <Select placeHolder="Personel Seçiniz!" values={teknisyenler} value={form.kalite} onChange={(e)=> formChange(e,'kalite')}/>
        </div>
        <div className="col-sm-12 col-xl-4 mb-3">
            <label className="form-label">Yönetici</label>
            <Select placeHolder="Yönetici Seçiniz!" values={yoneticiler} value={form.yonetici} onChange={(e)=> formChange(e,'yonetici')}/>
        </div>
      </div>

      <div className="mb-5">
        <label className="form-label">Malzemeler</label>
        <div className="d-flex mb-2">
          <Select
            placeHolder="Malzeme Seçiniz!"
            values={malzemeler}
            value={selectedMalzeme || { id: '', name: '' }}
            onChange={(e) => setSelectedMalzeme(e.target.value)}
          />
          <button type="button" className="btn btn-primary ms-2" onClick={malzemeEkle}>Ekle</button>
        </div>

        {errorMessage && (
            <div className="alert alert-danger">
              {errorMessage}
            </div>
          )}

        {
          malzemeList.length != 0 && <div>
            <table className="table text-start align-middle table-bordered mb-0">
              <thead>
                  <tr className="text-dark">
                      <th scope="col">Parça Adı</th>
                      <th scope="col">Stok No</th>
                      <th scope="col">Parça No</th>
                      <th scope="col">Miktar</th>
                      <th scope="col">Sarf Yeri</th>
                      <th scope="col">Tedarik Yeri</th>
                      <th scope="col">Fiyatı</th>
                      <th scope="col"></th>
                  </tr>
              </thead>
              <tbody>
                {malzemeList.map((malzeme,index) =>
                  <tr key={index}>
                      <td>{malzeme.name}</td>
                      <td>{malzeme.stokNo}</td>
                      <td>{malzeme.parcaNo}</td>
                      <td className="d-flex">{malzeme.miktar} / <input className="form-control" value={malzeme.girilenMiktar } style={{width:90,marginLeft:5,height:26}} onChange={(e)=> malzemeMiktarChange(e,index)} /></td>
                      <td>{malzeme.sarfYeri}</td>
                      <td>{malzeme.tedarikYeri}</td>
                      <td>{malzeme.fiyati}</td>

                      <td style={{width:30}}>
                        <button className="btn btn-sm" onClick={() => malzemeSil(malzeme.id)}>
                          <i className="fa fa-times"></i>
                        </button>
                      </td>
                  </tr>
                )}
              </tbody>
          </table>

          </div>
        }
      </div>

      <div>
        <button className="btn btn-primary " onClick={saveClick}>Kaydet</button>
        <button className="btn btn-success ms-3" onClick={generateClick}>Rapor Oluştur</button>
      </div>

    </Layout>
  )
}

export default Form;
