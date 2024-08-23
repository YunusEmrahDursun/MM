import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { com } from "support";
import LineChart from './components/LineChart';
import moment from "moment";
interface dataType{
  maintenances:number,
  faults:number,
  maintenancesAylik:any[],
  faultsAylik:any[],
}
function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<dataType>({
    maintenances:0,
    faults:0,
    maintenancesAylik:[],
    faultsAylik:[]
  })
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    Promise.all([
      com.sql({ type: 'customQuery', query: 'SELECT COUNT(*) as count FROM maintenances;' }),
      com.sql({ type: 'customQuery', query: 'SELECT COUNT(*) as count FROM faults;' }),
      com.sql({ type: 'customQuery', query: `SELECT strftime('%m', datetime(baslangicTarihi / 1000, 'unixepoch')) AS ay, COUNT(*) AS bakim_sayisi
        FROM maintenances
        WHERE strftime('%Y', datetime(baslangicTarihi / 1000, 'unixepoch')) = '${moment().format('YYYY')}'
        GROUP BY ay
        ORDER BY ay;` }),
      com.sql({ type: 'customQuery', query: `SELECT strftime('%m', datetime(baslangicTarihi / 1000, 'unixepoch')) AS ay, COUNT(*) AS bakim_sayisi
        FROM faults
        WHERE strftime('%Y', datetime(baslangicTarihi / 1000, 'unixepoch')) = '${moment().format('YYYY')}'
        GROUP BY ay
        ORDER BY ay;` }),
    ]).then(([maintenances, faults, maintenancesAylik, faultsAylik]) => {
      const maintenanceCounts = Array(12).fill(0);
      const faultsCounts = Array(12).fill(0);

      maintenancesAylik.forEach(item => {
        const monthIndex = parseInt(item.ay, 10) - 1;
        maintenanceCounts[monthIndex] = item.bakim_sayisi;
      });

      faultsAylik.forEach(item => {
        const monthIndex = parseInt(item.ay, 10) - 1;
        faultsCounts[monthIndex] = item.bakim_sayisi;
      });

      setData({
        maintenances:maintenances[0].count,
        faults:faults[0].count,
        maintenancesAylik:maintenanceCounts,
        faultsAylik:faultsCounts
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
                <p className="mb-2">Toplam Form: {data.maintenances}</p>
              </div>
              <i className="fa fa-chart-area fa-3x text-primary"></i>
          </div>
      </div>
      <div role="button" className="col-sm-6 col-xl-3" onClick={()=>navigate('/fault')}>
          <div className="bg-light rounded d-flex align-items-center justify-content-between p-4">
              <div className="ms-3">
                <h6 className="mb-0">Arıza Formları</h6>
                <p className="mb-2">Toplam Form: {data.faults}</p>
              </div>
              <i className="fa fa-chart-bar fa-3x text-primary"></i>
          </div>
      </div>
      <div className="col-12" >
        <div className="bg-light rounded p-4">
          <LineChart maintenancesAylik={data.maintenancesAylik} faultsAylik={data.faultsAylik}/>
        </div>
      </div>
    </div>
  )
}

export default Home;
