import React, { useEffect, useState } from 'react'
import List from './components/List';
import Form from './components/Form';
import { Layout } from 'support';
const SubSystems = () => {
    const [tab, setTab] = useState('list')
    const [select, setSelect] = useState(null);

    useEffect(() => {
      if(tab == 'list'){
        setSelect(null);
      }
    }, [tab])

    const selectItem = (item) => {
      setSelect(item);
      setTab('form');
    }

    const afterSaved = () => {
      setTab('list');
    }

    return (
        <Layout>
          <nav className='mb-3'>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <button className={"nav-link " + ( tab == 'list' && 'active') }  data-bs-toggle="tab" type="button" onClick={()=> setTab('list')}>Alt Sistemler</button>
              <button className={"nav-link " + ( tab == 'form' && 'active') }  data-bs-toggle="tab"  type="button" onClick={()=> setTab('form')}>Alt Sistem Ekle/Güncelleştir</button>
            </div>
          </nav>
          { tab == 'list' && <List selectItem={selectItem}/>}
          { tab == 'form' && <Form afterSaved={afterSaved} select={select}/>}
        </Layout>
    )
}

export default SubSystems
