import { useEffect, useState } from "react";
import { Layout } from "support";
import { generatePdfBakim } from "./components/generator";
const initialForm = {name:''};
function Maintenance() {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    generatePdfBakim({
      birlikAdi:"birlikAdi",
      sistemAdi:"sistemAdi",
      bolgeKodu:"bolgeKodu",
      kontrolNo:"kontrolNo",
      belgeTarihi:"belgeTarihi",
      tarih:"tarih",
      bakimBaslangicZamani:"bakimBaslangicZamani",
      bakimBitisZamani:"bakimBitisZamani",
      periyod:"periyod",
      malzemeler:"malzemeler",
      dokuman:"dokuman",
      aciklama:"aciklama",
      personel:"personel",
      yonetici:"yonetici"
    });
  }, [])

  const generateClick = () => {
    generatePdfBakim({
      birlikAdi:"birlikAdi",
      sistemAdi:"sistemAdi",
      bolgeKodu:"bolgeKodu",
      kontrolNo:"kontrolNo",
      belgeTarihi:"belgeTarihi",
      tarih:"tarih",
      bakimBaslangicZamani:"bakimBaslangicZamani",
      bakimBitisZamani:"bakimBitisZamani",
      periyod:"periyod",
      malzemeler:"malzemeler",
      dokuman:"dokuman",
      aciklama:"aciklama",
      personel:"personel",
      yonetici:"yonetici"
    });
  }
  const formChange = (e, key) => {
    setForm({...form, [key]:e.target.value})
  }
  return (
    <Layout title="Rapor Oluştur">
      <button onClick={generateClick}>cccc</button>
    </Layout>
  )
}

export default Maintenance;
