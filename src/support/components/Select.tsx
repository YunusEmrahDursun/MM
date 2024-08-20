import React from 'react'

interface propsType {
    values:any[] | null,
    onChange:Function,
    value:any,
    placeHolder:string
}
const Select = (props:propsType) => {

  const selectChange = (e) => {
    if(props.values){
      const obj = { target: { value:null}}
      obj.target.value = props.values.find(i=> i.id == e.target.value ) || { id: '' }
      props.onChange(obj)
    }
  }

  return (
    <select className="form-select " aria-label="Seçiniz" value={props.value.id} onChange={(e)=> selectChange(e)}>
      <option>{props.placeHolder}</option>
      {
        props.values && props.values.map((i:any)=> <option key={i.id} value={i.id} >{i.name}</option>)
      }
    </select>
  )
}

export default Select
