import StatItem from "../common/StatItem";

export default function DatasetFoundation(){

return(

<div className="elevated-card rounded-3xl p-8">

<h2 className="text-3xl font-bold mb-8">

Dataset Foundation

</h2>

<div className="grid md:grid-cols-4 gap-8">

<StatItem
label="Total Samples"
value="68,606"
/>

<StatItem
label="Domains"
value="3"
/>

<StatItem
label="Annotations"
value="69,951"
/>

<StatItem
label="Expert Agents"
value="3"
/>

</div>

</div>

)

}