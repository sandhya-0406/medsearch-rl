const health=[

["GPU","Online"],

["Dataset","Ready"],

["Inference","Available"],

["Models","Loaded"],

["API","Running"],

["RL","Operational"]

];

export default function PlatformHealth(){

return(

<div className="elevated-card rounded-3xl p-8">

<h2 className="text-3xl font-bold mb-8">

Platform Health

</h2>

<div className="grid md:grid-cols-3 gap-5">

{health.map(([title,status])=>(

<div

key={title}

className="
rounded-2xl
p-6
"

style={{
background:"var(--surface-2)"
}}

>

<div
className="
w-3
h-3
rounded-full
mb-4
bg-emerald-400
"
/>

<h4 className="font-semibold">

{title}

</h4>

<p
className="mt-2"
style={{
color:"var(--muted)"
}}
>

{status}

</p>

</div>

))}

</div>

</div>

)

}