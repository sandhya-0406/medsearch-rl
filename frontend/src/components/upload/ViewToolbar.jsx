import {
    ZoomIn,
    ZoomOut,
    Maximize,
    RotateCcw,
    Grid3X3
} from "lucide-react";

export default function ViewerToolbar({

    zoom,
    setZoom

}){

    function increase(){

        setZoom(z=>Math.min(z+0.1,3));

    }

    function decrease(){

        setZoom(z=>Math.max(z-0.1,0.5));

    }

    function reset(){

        setZoom(1);

    }

    return(

        <div
            className="
                flex
                items-center
                gap-3
                mb-5
                flex-wrap
            "
        >

            <ToolbarButton
                icon={ZoomIn}
                label="Zoom In"
                onClick={increase}
            />

            <ToolbarButton
                icon={ZoomOut}
                label="Zoom Out"
                onClick={decrease}
            />

            <ToolbarButton
                icon={Maximize}
                label="Fit"
                onClick={()=>setZoom(1)}
            />

            <ToolbarButton
                icon={RotateCcw}
                label="Reset"
                onClick={reset}
            />

            <ToolbarButton
                icon={Grid3X3}
                label="Grid"
            />

        </div>

    )

}

function ToolbarButton({

icon:Icon,

label,

onClick

}){

return(

<button

onClick={onClick}

className="
flex
items-center
gap-2
px-4
py-2
rounded-xl
transition
hover:scale-105
"

style={{

background:"var(--surface-2)"

}}

>

<Icon size={17}/>

<span className="text-sm">

{label}

</span>

</button>

)

}