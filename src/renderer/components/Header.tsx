import { useState } from "react"
import { useGlobalState } from "support";

export default () => {
  const { state, dispatch } = useGlobalState();

  const sideBarToogleClick = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR', value: !state.sidebar });
  }
  
  return (
    <nav className="navbar navbar-expand bg-light navbar-light sticky-top py-0">
      <a href="#" className="sidebar-toggler flex-shrink-0" onClick={sideBarToogleClick}>
        <i className="fa fa-bars" />
      </a>
    </nav>
  )
}
