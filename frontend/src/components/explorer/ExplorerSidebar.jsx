import useExplorer from "../../hooks/useExplorer";

import StatCard from "./sidebar/StatCard";

import ActionHistory from "./sidebar/ActionHistory";

export default function ExplorerSidebar(){

const{currentFrame} = useExplorer();

const box=

currentFrame.searchWindow;

return(

<div className="space-y-5">

<StatCard

title="Reward"

value={currentFrame.reward}

/>

<StatCard

title="IoU"

value={currentFrame.iou}

/>

<StatCard

title="Confidence"

value={currentFrame.confidence}

/>

<StatCard

title="Current Action"

value={currentFrame.action}

/>

<ActionHistory/>

</div>

)

}