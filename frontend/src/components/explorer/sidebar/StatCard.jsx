import Card from "../../common/GlassCard";

export default function StatCard({

title,

value

}){

return(

<Card>

<p className="text-sm text-muted-foreground">

{title}

</p>

<h2 className="text-2xl font-bold mt-2">

{value}

</h2>

</Card>

)

}