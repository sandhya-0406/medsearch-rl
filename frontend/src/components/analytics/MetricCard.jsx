import Card from "../common/GlassCard";

export default function MetricCard({

title,
value,
subtitle

}){

return(

<Card className="transition duration-300 hover:-translate-y-1 hover:shadow-xl">

<p className="text-sm text-muted-foreground">

{title}

</p>

<h2 className="text-3xl font-bold mt-2">

{value}

</h2>

{subtitle && (

<p className="mt-2 text-xs text-muted-foreground">

{subtitle}

</p>

)}

</Card>

)

}