import {  useEffect, useRef, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/img/logo.png';
import { useGlobalState } from "./../../support/index";

export default () => {

  const location = useLocation();
  const { state, dispatch } = useGlobalState();
  const [menu, setMenu] = useState<any>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        sideBarClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if(state.admin){
      setMenu([
        { text: 'Ana Ekran', icon: 'fa-tachometer-alt', link: '/' },
        { text: 'Malzeme', icon: 'fa-window-maximize', link: '/stocks' },
        {
          text: 'Tanımlar', icon: 'fa-cogs', subrows: [
            { text: 'Birlikler', link: '/sides' },
            { text: 'Sistemler', link: '/systems' },
            { text: 'Alt Sistemler', link: '/subSystems' },
            { text: 'Cihazlar', link: '/devices' },
            { text: 'Alt Cihazlar', link: '/subDevices' },
            { text: 'Periyodlar', link: '/periyods' },
            { text: 'Teknisyenler', link: '/technicians' },
            { text: 'Görevli Personel', link: '/officers' },
            { text: 'Bakım Takvimi', link: '/calender' },
          ]
        }
      ])
    }else{
      setMenu([
        { text: 'Ana Ekran', icon: 'fa-tachometer-alt', link: '/' },
        { text: 'Malzeme', icon: 'fa-window-maximize', link: '/stocks' },
      ])
    }
  }, [state.admin])

  const sideBarClick = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR', value: false });
  }

  return (
    <div className={"sidebar pe-4 pb-3 "+ (state.sidebar ? 'open' : '')} ref={sidebarRef}>
        <nav className="navbar bg-light navbar-light position-relative">
            <Link to={'/'} className="navbar-brand mx-4 w-100">
              <h3 className="text-primary text-center">
                M&M
              </h3>
            </Link>

          <div className="d-flex align-items-center ms-4">
            <div className="position-relative">
              <img className="rounded-circle" src={logo}/>
            </div>
          </div>

          <div className="navbar-nav w-100">
            {
              menu.map((item,index)=> <DrawItem key={index} item={{...item,isActive:item.link && isActive(item.link)}}/>)
            }
          </div>
        </nav>
    </div>
  )
}

const DrawItem = ({item}) => {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useGlobalState();

  const toogleClick = () => {
    setOpen(!open);
  }

  const sideBarClick = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR', value: false });
  }

  return (
    <>
      {
        item.subrows ? <>
          <div className="nav-item dropdown">
            <a href="#" className={"nav-link dropdown-toggle "+ (open ? 'show' : '')} data-bs-toggle="dropdown" onClick={toogleClick}>
              <i className={"fa me-2 "+ item.icon} />
              {item.text}
            </a>
            <div className={"dropdown-menu bg-transparent border-0 "+ (open ? 'show' : '')}>
              {
                item.subrows.map((row,index) => (
                  <Link onClick={sideBarClick} key={index} to={row.link || '#'} className="dropdown-item">
                    {row.text}
                  </Link>
                ))
              }
            </div>
          </div>
        </> : <>
          <Link onClick={sideBarClick} to={item.link || '#'} className={"nav-item nav-link "+ (item.isActive ? 'active' : '')} >
            <i className={"fa me-2 "+ item.icon } />
            {item.text}
          </Link>
        </>
      }
    </>
  )
}

