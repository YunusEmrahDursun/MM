import { useState } from "react";
import { useGlobalState } from "support";
import { com} from "support";
export default () => {
  const { state, dispatch } = useGlobalState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');

  const sideBarToogleClick = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR', value: !state.sidebar });
  }
  const loginClick = () => {
    if(password != ''){
      com.sql({ type: 'selectQuery', tableName: 'pass', where:{password:btoa(password)} }).then(i=> {
        if(i.length != 0 ){
          dispatch({ type: 'ADMIN', value:true });
        }
      })
    }
    setIsModalOpen(false);
    setPassword('');
  }

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setPassword('');
  }

  return (
    <>
      <nav className="navbar navbar-expand bg-light navbar-light sticky-top py-0">
        <a href="#" className="sidebar-toggler flex-shrink-0" onClick={sideBarToogleClick}>
          <i className="fa fa-bars" />
        </a>
        { state.admin == false && <a href="#" className="sidebar-toggler flex-shrink-0" onClick={openModal}>
          <i className="fa fa-user" />
        </a>}
      </nav>
     {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Şifre Girişi</h3>
              <input className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifeyi Giriniz"
                required
              />
              <div className="mt-3">
                <button className="btn btn-primary" onClick={loginClick}>Giriş Yap</button>
                <button className="btn btn-primary  ms-3" type="button" onClick={closeModal}>İptal</button>
              </div>
          </div>
        </div>
      )}
    </>

  )
}
