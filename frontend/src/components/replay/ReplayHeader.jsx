import useExplorer from "../../hooks/useExplorer";

export default function ReplayHeader(){

const{

domain

}=useExplorer();

return(

<div className="flex justify-between">

<div>

<h1 className="text-3xl font-bold">

Replay Studio

</h1>

<p className="text-muted-foreground">

Replay every reinforcement learning decision.

</p>

</div>

<div className="px-4 py-2 rounded-xl bg-primary text-white">

{domain}

</div>

</div>

)

}