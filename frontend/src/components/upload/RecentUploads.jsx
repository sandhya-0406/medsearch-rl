import {

    Brain,

    Microscope,

    CheckCircle2,

    ChevronRight

} from "lucide-react";

const uploads=[

{

title:"MRI_001.png",

domain:"Brain MRI",

time:"2 min ago",

icon:Brain,

color:"#22d3ee"

},

{

title:"Procedure_014.jpg",

domain:"ESAD",

time:"Today",

icon:Microscope,

color:"#8b5cf6"

},

{

title:"MESAD_007.jpg",

domain:"MESAD",

time:"Yesterday",

icon:Microscope,

color:"#10b981"

}

];

export default function RecentUploads(){

return(

<div
className="
elevated-card
rounded-[28px]
p-8
"
>

<h2
className="
text-2xl
font-bold
mb-7
"
>

Recent Uploads

</h2>

<div
className="
space-y-5
"
>

{

uploads.map(upload=>{

const Icon=upload.icon;

return(

<div

key={upload.title}

className="
flex
items-center
justify-between

rounded-2xl

p-4

transition-all

hover:bg-white/5

cursor-pointer
"

>

<div
className="
flex
items-center
gap-4
"
>

<div
className="
w-12
h-12

rounded-xl

flex
items-center
justify-center
"
style={{
background:"var(--surface-2)"
}}
>

<Icon
size={22}
style={{
color:upload.color
}}
/>

</div>

<div>

<h4
className="
font-semibold
"
>

{upload.title}

</h4>

<p
className="
text-sm
"
style={{
color:"var(--muted)"
}}
>

{upload.domain}

</p>

<p
className="
text-xs
mt-1
"
style={{
color:"var(--muted)"
}}
>

{upload.time}

</p>

</div>

</div>

<div
className="
flex
items-center
gap-3
"
>

<CheckCircle2
size={18}
className="text-emerald-400"
/>

<ChevronRight
size={18}
/>

</div>

</div>

)

})

}

</div>

</div>

)

}