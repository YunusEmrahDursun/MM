import React, { useEffect, useState } from 'react'
import List from './components/List';
import Form from './components/Form';
import { Layout } from 'support';
import { useSearchParams } from 'react-router-dom';
const Maintenance = () => {
    const [searchParams] = useSearchParams();
    const [tab, setTab] = useState(searchParams.get('to') == 'add' ? 'form' : 'list')
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
              <button className={"nav-link " + ( tab == 'list' && 'active') }  data-bs-toggle="tab" type="button" onClick={()=> setTab('list')}>Bakım Formları</button>
              <button className={"nav-link " + ( tab == 'form' && 'active') }  data-bs-toggle="tab"  type="button" onClick={()=> setTab('form')}>Bakım Formu Ekle/Güncelleştir</button>
            </div>
          </nav>
          { tab == 'list' && <List selectItem={selectItem}/>}
          { tab == 'form' && <Form afterSaved={afterSaved} select={select}/>}
        </Layout>
    )
}

export default Maintenance
