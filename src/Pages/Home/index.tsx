import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { com } from "support";
import LineChart from './components/LineChart';
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import './style.css';
moment.locale("tr");
const localizer = momentLocalizer(moment);
interface dataType{
  maintenances:number,
  faults:number,
  maintenancesAylik:any[],
  faultsAylik:any[],
}

const initialEvents:any = [];

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState(initialEvents);
  const [selectedDateEvents, setSelectedDateEvents] = useState<any[]>([]);
  const [showData, setShowData] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentMonthMaintences, setCurrentMonthMaintences] = useState([])
  const [data, setData] = useState<dataType>({
    maintenances:0,
    faults:0,
    maintenancesAylik:[],
    faultsAylik:[]
  })
  useEffect(() => {
    getData();
    handleNavigate();
  }, []);

  useEffect(() => {
    const arr:any = [];
    const tempEvents = [...events];
    currentMonthMaintences.forEach((m:any)=> {
      const found = tempEvents.find(e=> e.sistemId == m.device && e.altSistemId == m.subDevice && m.periyodName == e.period && moment(e.start).format('DD-MM-YYYY') == moment(m.baslangicTarihi).format('DD-MM-YYYY'))
      if(found){
        found.finish = true;
      }else{
        arr.push({
          "title":m.deviceName + '-' + m.subDeviceName + ' ('+m.periyodName +')',
          "start":new Date(m.baslangicTarihi),
          "end":new Date(m.bitisTarihi),
          "sistem":m.deviceName,
          "altSistem":m.subDeviceName,
          "period":m.periyodName,
          "sistemId":m.device,
          "altSistemId":m.subDevice,
          "finish":true
        })
      }
    })
    setShowData([...tempEvents, ...arr ])
  }, [currentMonthMaintences, events])
  

  const getData = () => {
    Promise.all([
      com.sql({ type: 'customQuery', query: 'SELECT COUNT(*) as count FROM maintenances where deleted = 0;' }),
      com.sql({ type: 'customQuery', query: 'SELECT COUNT(*) as count FROM faults where deleted = 0;' }),
      com.sql({ type: 'customQuery', query: `SELECT strftime('%m', datetime(baslangicTarihi / 1000, 'unixepoch', '+3 hours')) AS ay, COUNT(*) AS bakim_sayisi
        FROM maintenances
        WHERE deleted = 0 AND strftime('%Y', datetime(baslangicTarihi / 1000, 'unixepoch', '+3 hours')) = '${moment().format('YYYY')}'
        GROUP BY ay
        ORDER BY ay;` }),
      com.sql({ type: 'customQuery', query: `SELECT strftime('%m', datetime(baslangicTarihi / 1000, 'unixepoch', '+3 hours')) AS ay, COUNT(*) AS bakim_sayisi
        FROM faults
        WHERE deleted = 0 AND strftime('%Y', datetime(baslangicTarihi / 1000, 'unixepoch', '+3 hours')) = '${moment().format('YYYY')}'
        GROUP BY ay
        ORDER BY ay;` }),
      com.sql({
        type:'selectAll',
        tableName:'calender'
      })
    ]).then(([maintenances, faults, maintenancesAylik, faultsAylik, calendar]) => {
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
      const tempEvents:any = [];
      calendar.forEach(i => {
        const arr = JSON.parse(i.data);
        arr.forEach(item => {
          item.aylar.forEach((ay,ayIndex) =>{
            if(ay.includes('#')){
              const tmp = ay.replace(/#/g,'').split('-');
              tempEvents.push({
                title: item.sistem + '-' + item.altSistem + ' ('+ item.period +')',
                start:new Date(i.year, ayIndex, tmp[0]),
                end:new Date(i.year, ayIndex, tmp[1]),
                sistem:item.sistem,
                altSistem:item.altSistem,
                period:item.period,
                sistemId:item.sistemId,
                altSistemId:item.altSistemId
              })
            }
            else if(ay.trim() != '-'){
              const splitedAy = ay.split('-');
              splitedAy.forEach(gun => {
                tempEvents.push({
                  title: item.sistem + '-' + item.altSistem + ' ('+ item.period +')',
                  start:new Date(i.year, ayIndex, gun),
                  end:new Date(i.year, ayIndex, gun),
                  sistem:item.sistem,
                  altSistem:item.altSistem,
                  period:item.period,
                  sistemId:item.sistemId,
                  altSistemId:item.altSistemId
                })
              });
              
            }

            
          })
          
        });
      });
      setEvents(tempEvents)
    }).catch(error => {

    });


  }

  const handleDateClick = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY");
    const dateEvents = showData.filter(event =>
      moment(event.start).format("DD-MM-YYYY") === formattedDate
    );
    setSelectedDateEvents(dateEvents);
    setModalTitle(formattedDate);
    setShowModal(true);
  };

  const handleEventClick = (e) => {
    navigate('/maintenance?to=add', { state: e })
  };

  const onClose = () => {
    setShowModal(false);
    setSelectedDateEvents([]);
    setModalTitle('');
  };

  const handleNavigate = (date = moment().valueOf() ) => {
    const monthYear = moment(date).format('MM/YYYY'); 
    const [month, year] = monthYear.split('/');
    com.sql({ type: 'customQuery', query: `
    SELECT m.*, d.name as deviceName, sd.name as subDeviceName, p.name as periyodName 
    FROM maintenances m
    JOIN devices d ON m.device = d.id
    JOIN subDevices sd ON m.subDevice = sd.id
    JOIN periyods p ON m.periyod = p.id
    WHERE m.deleted = 0 AND strftime('%m', datetime(m.baslangicTarihi / 1000, 'unixepoch', '+3 hours')) = '${month}'
      AND strftime('%Y', datetime(m.baslangicTarihi / 1000, 'unixepoch', '+3 hours')) = '${year}'
  ` }).then(res=>{
      console.log(res)
      setCurrentMonthMaintences(res);
    })
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.finish ? 'green' : '#3174ad',
        color: 'white',
      }
    };
  };

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
        <div className="bg-light rounded p-4" style={{ height: 800 }}>
          <Calendar
            localizer={localizer}
            events={showData}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={({ start }) => handleDateClick(start)}
            onSelectEvent={handleEventClick}
            onDrillDown={(start) => handleDateClick(start)}
            views={['month']} 
            toolbar={true}    
            style={{ height: 700 }}
            onNavigate={handleNavigate}
            eventPropGetter={eventStyleGetter}
            messages={{
              next: "Sonraki",
              previous: "Önceki",
              today: "Bugün",
              month: "Ay",
              week: "Hafta",
              day: "Gün",
              agenda: "Ajanda",
              date: "Tarih",
              time: "Zaman",
              event: "Olay",
              showMore: (total) => `+${total} daha fazla`, 
            }}
            
          />
        </div>
      </div>
      <div className="col-12" >
        <div className="bg-light rounded p-4">
          <LineChart maintenancesAylik={data.maintenancesAylik} faultsAylik={data.faultsAylik}/>
        </div>
      </div>
      {showModal && <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{modalTitle}</h5>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            {selectedDateEvents.length > 0 ? (
              <ul className="event-list">
                {selectedDateEvents.map(event => (
                  <li key={event.id} className={"event-item " + (event.finish ? 'active' : '') } onClick={() => handleEventClick(event)}>
                    {event.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-events">Bu tarihte hiçbir bakım bulunmuyor.</p>
            )}
          </div>
          <div className="modal-footer">
            <button className="modal-btn" onClick={onClose}>Kapat</button>
          </div>
        </div>
      </div>}
    </div>
  )
}

export default Home;
