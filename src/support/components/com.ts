import { Buffer } from "buffer";

const sql = async (obj) => {
    return JSON.parse(await window.electron.ipcRenderer.invoke('ipc-com', JSON.stringify(obj)));
}

const print = async (obj) => {
    const pdfData = obj.output("arraybuffer");
    await window.electron.ipcRenderer.invoke('ipc-com', { type: 'print',data: Buffer.from(pdfData)});
}

export { sql, print };