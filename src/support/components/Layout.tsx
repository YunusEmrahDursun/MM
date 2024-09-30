interface propsType{
    title?:string
    children:any
}
const Layout = (props:propsType) => {
    return (
        <div className="bg-light rounded h-100 p-4" style={{width: '100%',overflowX: 'auto', minHeight:300}}>
            <h6 className="mb-3">{props.title}</h6>
            {props.children}
        </div>
    )
}

export default Layout
