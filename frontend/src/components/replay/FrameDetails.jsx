import Card from "../common/GlassCard";

import useExplorer from "../../hooks/useExplorer";

export default function FrameDetails(){

const{

currentFrame,

currentStep

}=useExplorer();

return(

<Card className="space-y-5">

<h3>

Frame Details

</h3>

<div>

<p>

Current Step

</p>

<h2>

{currentStep}

</h2>

</div>

<div>

<p>

Action

</p>

<h2>

{currentFrame.action}

</h2>

</div>

<div>

<p>

Reward

</p>

<h2>

{currentFrame.reward}

</h2>

</div>

<div>

<p>

IoU

</p>

<h2>

{currentFrame.iou}

</h2>

</div>

<div>

<p>

Confidence

</p>

<h2>

{currentFrame.confidence}

</h2>

</div>

</Card>

)

}