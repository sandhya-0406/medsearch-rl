import {

Play,

Pause,

SkipBack,

SkipForward

} from "lucide-react";

import Card from "../../common/GlassCard";

import useExplorer from "../../../hooks/useExplorer";

export default function PlaybackControls(){

const{

playing,

setPlaying

}=useExplorer();

return(

<Card className="flex justify-center gap-4">

<button>

<SkipBack/>

</button>

<button

onClick={()=>setPlaying(!playing)}

>

{

playing

?

<Pause/>

:

<Play/>

}

</button>

<button>

<SkipForward/>

</button>

</Card>

)

}