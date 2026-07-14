export default function CustomTooltip({

active,

payload,

label

}){

if(!active||!payload)return null;

return(

<div className="bg-surface border border-border rounded-xl p-4 shadow-lg">

<p>

Episode {label}

</p>

<h3>

{payload[0].value}

</h3>

</div>

)

}