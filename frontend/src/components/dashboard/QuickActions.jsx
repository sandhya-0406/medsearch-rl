import {
    Upload,
    Play,
    BarChart3,
    Microscope
} from "lucide-react";

const actions = [

{
icon:Upload,
title:"Upload Image",
subtitle:"Analyze new scan"
},

{
icon:Play,
title:"Run Demo",
subtitle:"Launch inference"
},

{
icon:BarChart3,
title:"Analytics",
subtitle:"Training metrics"
},

{
icon:Microscope,
title:"Playground",
subtitle:"Research tools"
}

];

export default function QuickActions(){

return(

<div className="elevated-card rounded-3xl p-7">

<h2 className="text-2xl font-bold mb-6">
Quick Actions
</h2>

<div className="grid grid-cols-2 gap-4">

{actions.map(action=>{

const Icon=action.icon;

return(

<button
key={action.title}
className="
group
rounded-2xl
p-5
text-left
transition-all
hover:-translate-y-1
"
style={{
background:"var(--surface-2)"
}}
>

<Icon
className="
text-cyan-400
mb-4
group-hover:scale-110
transition
"
/>

<h4 className="font-semibold">
{action.title}
</h4>

<p
className="text-sm mt-1"
style={{
color:"var(--muted)"
}}
>
{action.subtitle}
</p>

</button>

)

})}

</div>

</div>

)

}