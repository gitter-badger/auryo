import {ipcRenderer} from "electron";

export function minimize(){
  ipcRenderer.send('minimize');
}
export function maximize(){
  ipcRenderer.send('maximize');
}
export function close(){
  ipcRenderer.send('close');
}
