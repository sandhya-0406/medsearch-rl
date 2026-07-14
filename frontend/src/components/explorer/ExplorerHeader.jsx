import useExplorer

from "../../hooks/useExplorer";

export default function ExplorerHeader(){

const{

domain,

setDomain

}=useExplorer();

return(

<div className="flex items-center justify-between">

<div>

<h1 className="text-3xl font-bold">

Agent Explorer

</h1>

<p className="text-muted-foreground">

Watch the RL agent search the medical image.

</p>

</div>

<div className="flex gap-2">

{["MRI","ESAD","MESAD"]

.map(item=>

<button

key={item}

onClick={()=>

setDomain(item)

}

className={`

px-4 py-2 rounded-xl transition

${domain===item

?

"bg-primary text-white"

:

"border border-border"

}

`}

>

{item}

</button>

)}

</div>

</div>

);

}