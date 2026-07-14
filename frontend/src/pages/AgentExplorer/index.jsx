import { ExplorerProvider }

from "../../context/ExplorerContext";

import ExplorerHeader

from "../../components/explorer/ExplorerHeader";

import AgentViewport

from "../../components/explorer/viewport/AgentViewport";

import ExplorerSidebar

from "../../components/explorer/ExplorerSidebar";

import ExplorerToolbar from "../../components/explorer/ExplorerToolbar";
import PlaybackControls from "../../components/explorer/timeline/PlaybackControls";
import Timeline from "../../components/explorer/timeline/Timeline";

export default function AgentExplorer(){

return(

<div className="space-y-6">

<ExplorerHeader/>

<ExplorerToolbar/>

<div className="grid grid-cols-12 gap-6">

<div className="col-span-9">

<AgentViewport/>

</div>

<div className="col-span-3">

<ExplorerSidebar/>

</div>

</div>

<PlaybackControls/>

<Timeline/>

</div>

);

}