import Card from "../../common/GlassCard";
import useExplorer from "../../../hooks/useExplorer";
export default function Timeline(){
const{

currentStep,

setCurrentStep,

data

}=useExplorer();
return(

<Card>

<input

type="range"

min="0"

max={

data.replay.length-1

}

value={

currentStep

}

onChange={(e)=>

setCurrentStep(

Number(

e.target.value

)

)

}

className="w-full"

/>

</Card>

)

}