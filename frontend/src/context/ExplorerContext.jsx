import {

createContext,

useContext,

useMemo,

useState

} from "react";

import { getExplorerData }

from "../services/explorerService";

import{

useEffect

}from"react";

import{

playReplay

}

from

"../../utils/replay/replayEngine";

const ExplorerContext=createContext();

export function ExplorerProvider({

children

}){

const[domain,setDomain]=useState("MRI");

const data=useMemo(

()=>getExplorerData(domain),

[domain]

);

const [analysis, setAnalysis] = useState(null);

const [image, setImage] = useState(null);

const [imageMetadata, setImageMetadata] = useState({});

const [playing,setPlaying]=useState(false);

const [speed,setSpeed]=useState(1);

const [showGrid,setShowGrid]=useState(true);

const [showBoxes,setShowBoxes]=useState(true);

const [showTrajectory,setShowTrajectory]=useState(true);

const [showHeatmap,setShowHeatmap]=useState(false);

const [showCrosshair,setShowCrosshair]=useState(false);

const [currentStep,setCurrentStep]= useState(0);

const currentFrame =
    data?.replay?.[currentStep] ??
    data?.replay?.[0];

useEffect(()=>{

return playReplay({

playing,

speed,

currentStep,

maxSteps:

data.replay.length-1,

setCurrentStep

});

},[

playing,

speed,

currentStep,

data

]);
const loadAnalysis = (payload) => {

    setAnalysis(payload);

    setImage(payload.image);

    setImageMetadata(payload.metadata || {});

    setDomain(payload.domain || "MRI");

    setCurrentStep(0);

    setPlaying(false);

};

const resetExplorer = () => {

    setAnalysis(null);

    setImage(null);

    setImageMetadata({});

    setCurrentStep(0);

    setPlaying(false);

    setSpeed(1);

    setShowGrid(true);

    setShowBoxes(true);

    setShowTrajectory(true);

    setShowHeatmap(false);

    setShowCrosshair(false);

};

const value={

domain,
setDomain,

data,

playing,
setPlaying,

speed,
setSpeed,

showGrid,
setShowGrid,

showBoxes,
setShowBoxes,

showTrajectory,
setShowTrajectory,

showHeatmap,
setShowHeatmap,

showCrosshair,
setShowCrosshair,

currentStep,

setCurrentStep,

currentFrame,

analysis,

image,

imageMetadata,

loadAnalysis,

resetExplorer

}

return(

<ExplorerContext.Provider

value={value}

>

{children}

</ExplorerContext.Provider>

);

}

export function useExplorer(){

return useContext(

ExplorerContext

);

}