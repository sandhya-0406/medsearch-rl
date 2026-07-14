import Card from "../common/GlassCard";

import useExplorer from "../../hooks/useExplorer";

export default function ReplaySummary(){

const{

data,

speed

}=useExplorer();

return(

<div className="grid grid-cols-4 gap-5">

<Card>

<p>

Episode

</p>

<h2>

#001

</h2>

</Card>

<Card>

<p>

Frames

</p>

<h2>

{data.replay.length}

</h2>

</Card>

<Card>

<p>

Playback Speed

</p>

<h2>

{speed}x

</h2>

</Card>

<Card>

<p>

Duration

</p>

<h2>

12.4 sec

</h2>

</Card>

</div>

)

}