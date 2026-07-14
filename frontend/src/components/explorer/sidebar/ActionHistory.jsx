import Card from "../../common/GlassCard";

const actions=[

"Move Right",

"Move Down",

"Zoom In",

"Move Left",

"Move Up"

];

export default function ActionHistory(){

return(

<Card>

<h3 className="font-semibold mb-4">

Recent Actions

</h3>

<div className="space-y-3">

{

actions.map((action,index)=>(

<div

key={index}

className="flex justify-between"

>

<span>

{action}

</span>

<span>

#{index+1}

</span>

</div>

))

}

</div>

</Card>

)

}