import mri from "../data/explorer/mri";
import esad from "../data/explorer/esad";
import mesad from "../data/explorer/mesad";

export function getExplorerData(domain){

switch(domain){

case "MRI":
return mri;

case "ESAD":
return esad;

case "MESAD":
return mesad;

default:
return mri;

}
}