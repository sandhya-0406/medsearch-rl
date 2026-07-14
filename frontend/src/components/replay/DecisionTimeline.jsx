import Card from "../common/GlassCard";

import useExplorer from "../../hooks/useExplorer";

export default function DecisionTimeline(){

const{

data,

currentStep

}=useExplorer();

return(

<Card>

<h3 className="mb-5">

Decision Timeline

</h3>

<div className="space-y-3 max-h-96 overflow-auto">

{

data.replay.map(frame=>(

<div

key={frame.step}

className={`

p-3 rounded-xl

${

frame.step===currentStep

?

"bg-primary text-white"

:

"bg-surface"

}

`}

>

<div className="flex justify-between">

<span>

Step {frame.step}

</span>

<span>

{frame.action}

</span>

</div>

</div>

))

}

</div>

</Card>

)

}