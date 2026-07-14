import Card from "../../common/GlassCard";

import ImageCanvas from "./ImageCanvas";

import SearchWindow from "./SearchWindow";

import BoundingBoxes from "./BoundingBoxes";

import HeatmapLayer from "./HeatmapLayer";

import TrajectoryLayer from "./TrajectoryLayer";

import Crosshair from "./Crosshair";

import useExplorer from "../../../hooks/useExplorer";

export default function AgentViewport(){

const{

showBoxes,

showTrajectory,

showHeatmap,

showCrosshair

}=useExplorer();

return(

<Card className="relative overflow-hidden">

<ImageCanvas/>

{showBoxes && <BoundingBoxes/>}

<SearchWindow/>

{showTrajectory && <TrajectoryLayer/>}

{showHeatmap && <HeatmapLayer/>}

{showCrosshair && <Crosshair/>}

</Card>

)

}