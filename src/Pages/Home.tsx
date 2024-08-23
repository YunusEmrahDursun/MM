import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { com } from "support";
function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    m:0,
    f:0
  })
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Promise.all([
      com.sql({ type: 'customQuery', query: 'SELECT COUNT(*) as count FROM maintenances;' }),
      com.sql({ type: 'customQuery', query: 'SELECT COUNT(*) as count FROM faults;' }),
    ]).then(([m,f]) => {
      setData({
        m:m[0].count,
        f:f[0].count
      })


    }).catch(error => {

    });


  }

  return (
    <div className="row g-4">
      <div role="button" className="col-sm-6 col-xl-3" onClick={()=>navigate('/maintenance?to=add')}>
          <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <div className="ms-3">
                <h6 className="mb-0">Bakım Formu Oluştur</h6>
                <p className="mb-2">Yeni form</p>
              </div>
              <i className="fa fa-briefcase fa-2x text-primary"></i>
          </div>
      </div>
      <div role="button" className="col-sm-6 col-xl-3" onClick={()=>navigate('/fault?to=add')}>
          <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <div className="ms-3">
                <h6 className="mb-0">Arıza Formu Oluştur</h6>
                <p className="mb-2">Yeni form</p>
              </div>
              <i className="fa fa-wrench fa-2x text-primary"></i>
          </div>
      </div>
      <div role="button" className="col-sm-6 col-xl-3" onClick={()=>navigate('/maintenance')}>
          <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <div className="ms-3">
                <h6 className="mb-0">Bakım Formları</h6>
                <p className="mb-2">Toplam Form: {data.m}</p>
              </div>
              <i className="fa fa-chart-area fa-3x text-primary"></i>
          </div>
      </div>
      <div role="button" className="col-sm-6 col-xl-3" onClick={()=>navigate('/fault')}>
          <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <div className="ms-3">
                <h6 className="mb-0">Arıza Formları</h6>
                <p className="mb-2">Toplam Form: {data.f}</p>
              </div>
              <i className="fa fa-chart-bar fa-3x text-primary"></i>
          </div>
      </div>
    </div>
  )
}

export default Home;
