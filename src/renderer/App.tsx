import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import './statics/fonts/css2.css';
import './statics/styles/allmin.css';
import './statics/lib/owlcarousel/assets/owlcarousel.css';
import './statics/lib/tempusdominus/css/tempusdominus-bootstrap-4.css';
import './statics/styles/bootstrap-min.css';
import './statics/styles/style.css';

import Home from '../Pages/Home';
import Maintenance from '../Pages/Maintenance';
import Fault from '../Pages/Fault';
import NotFound from '../Pages/NotFound';
import SideBar from './components/SideBar';
import Header from './components/Header';
import { Provider, useGlobalState } from 'support';
import Sides from '../Pages/Sides';
import Systems from '../Pages/Systems';
import Devices from '../Pages/Devices';
import Periyods from '../Pages/Periyods';
import Technicians from '../Pages/Technicians';
import Officers from '../Pages/Officers';
import Stocks from '../Pages/Stocks';
import Calender from '../Pages/Calender';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubSystems from 'Pages/SubSystems';
import SubDevices from 'Pages/SubDevices';
const Workspace = () => {
  const { state, dispatch } = useGlobalState();

  return (
    <div className="container-fluid position-relative bg-white d-flex p-0">
      <ToastContainer />
      <Router>
        <SideBar/>
        <div className={"content " +(state.sidebar ? 'open' : '') }>
          <Header/>
          <div className="container-fluid pt-4 px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/fault" element={<Fault />} />
              <Route path="/sides" element={<Sides />} />
              <Route path="/systems" element={<Systems />} />
              <Route path="/subSystems" element={<SubSystems />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/subDevices" element={<SubDevices />} />
              <Route path="/periyods" element={<Periyods />} />
              <Route path="/technicians" element={<Technicians />} />
              <Route path="/officers" element={<Officers />} />
              <Route path="/stocks" element={<Stocks />} />
              <Route path="/calender" element={<Calender />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>

  )
}

export default function App() {
  return (
    <Provider>
			<Workspace />
		</Provider>

  )
}
