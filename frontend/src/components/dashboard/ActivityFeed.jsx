const activities=[

{
title:"MRI uploaded",
time:"2 min ago"
},

{
title:"Training started",
time:"6 min ago"
},

{
title:"Checkpoint saved",
time:"11 min ago"
},

{
title:"Evaluation complete",
time:"22 min ago"
}

];

export default function ActivityFeed(){

return(

<div className="elevated-card rounded-3xl p-7">

<h2 className="text-2xl font-bold mb-6">
Live Activity
</h2>

<div className="space-y-5">

{activities.map(activity=>(

<div
key={activity.title}
className="flex items-start gap-4"
>

<div
className="w-2 h-2 rounded-full mt-2"
style={{
background:"var(--primary)"
}}
/>

<div>

<h4 className="font-medium">
{activity.title}
</h4>

<p
className="text-sm"
style={{
color:"var(--muted)"
}}
>
{activity.time}
</p>

</div>

</div>

))}

</div>

</div>

)

}