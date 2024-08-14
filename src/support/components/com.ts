const sql = async (obj) => {
    return JSON.parse(await window.electron.ipcRenderer.invoke('ipc-com', JSON.stringify(obj)));
}


export { sql };