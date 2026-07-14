export function playReplay({

playing,

speed,

currentStep,

maxSteps,

setCurrentStep

}){

if(!playing)return;

const timer=

setTimeout(()=>{

if(

currentStep<maxSteps

){

setCurrentStep(

step=>step+1

);

}

},1000/speed);

return()=>clearTimeout(timer);

}