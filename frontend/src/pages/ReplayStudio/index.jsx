import { ExplorerProvider } from "../../context/ExplorerContext";

import ReplayHeader from "../../components/replay/ReplayHeader";

import ReplaySummary from "../../components/replay/ReplaySummary";

import ReplayViewer from "../../components/replay/ReplayViewer";

import ReplayControls from "../../components/replay/ReplayControls";

import ReplayTimeline from "../../components/replay/ReplayTimeline";

import FrameDetails from "../../components/replay/FrameDetails";

import DecisionTimeline from "../../components/replay/DecisionTimeline";

export default function ReplayStudio(){

return(

    <div className="space-y-6">

    <ReplayHeader/>

    <ReplaySummary/>

    <ReplayViewer/>

    <ReplayControls/>

    <ReplayTimeline/>

    <div className="grid grid-cols-12 gap-6">

        <div className="col-span-4">

        <FrameDetails/>

        </div>

        <div className="col-span-8">

        <DecisionTimeline/>

        </div>

    </div>

    </div>

)

}