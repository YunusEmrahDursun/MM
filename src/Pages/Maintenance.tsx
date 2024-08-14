import { useState } from "react";
import { Layout } from "support";

const initialForm = {name:''};
function Maintenance() {
  const [form, setForm] = useState(initialForm);

  const generateClick = () => {

  }
  const formChange = (e, key) => {
    setForm({...form, [key]:e.target.value})
  }
  return (
    <Layout title="Rapor Oluştur">

    </Layout>
  )
}

export default Maintenance;
