import {
    Play,
    Pause,
    RotateCcw,
    Grid3X3,
    Route,
    Flame,
    Square,
    Crosshair,
    Gauge,
} from "lucide-react";

import Card from "../common/GlassCard";
import useExplorer from "../../hooks/useExplorer";

export default function ExplorerToolbar() {

    const {

        playing,
        setPlaying,

        showGrid,
        setShowGrid,

        showBoxes,
        setShowBoxes,

        showTrajectory,
        setShowTrajectory,

        showHeatmap,
        setShowHeatmap,

        showCrosshair,
        setShowCrosshair,

        speed,
        setSpeed

    } = useExplorer();

    const ToggleButton = ({active,onClick,children}) => (

        <button

            onClick={onClick}

            className={`
            px-4
            py-2
            rounded-xl
            transition

            ${
                active
                ?
                "bg-primary text-white"
                :
                "hover:bg-surface"
            }
            `}
        >

            {children}

        </button>

    );

    return (

        <Card className="flex items-center justify-between">

            <div className="flex gap-3">

                <ToggleButton

                    active={playing}

                    onClick={()=>

                        setPlaying(!playing)

                    }

                >

                    {

                        playing

                        ?

                        <Pause size={18}/>

                        :

                        <Play size={18}/>

                    }

                </ToggleButton>

                <ToggleButton>

                    <RotateCcw size={18}/>

                </ToggleButton>

            </div>

            <div className="flex gap-2">

                <ToggleButton

                    active={showGrid}

                    onClick={()=>

                        setShowGrid(!showGrid)

                    }

                >

                    <Grid3X3 size={18}/>

                </ToggleButton>

                <ToggleButton

                    active={showBoxes}

                    onClick={()=>

                        setShowBoxes(!showBoxes)

                    }

                >

                    <Square size={18}/>

                </ToggleButton>

                <ToggleButton

                    active={showTrajectory}

                    onClick={()=>

                        setShowTrajectory(

                            !showTrajectory

                        )

                    }

                >

                    <Route size={18}/>

                </ToggleButton>

                <ToggleButton

                    active={showHeatmap}

                    onClick={()=>

                        setShowHeatmap(

                            !showHeatmap

                        )

                    }

                >

                    <Flame size={18}/>

                </ToggleButton>

                <ToggleButton

                    active={showCrosshair}

                    onClick={()=>

                        setShowCrosshair(

                            !showCrosshair

                        )

                    }

                >

                    <Crosshair size={18}/>

                </ToggleButton>

            </div>

            <div className="flex items-center gap-3">

                <Gauge size={18}/>

                <input

                    type="range"

                    min="1"

                    max="5"

                    value={speed}

                    onChange={(e)=>

                        setSpeed(

                            Number(

                                e.target.value

                            )

                        )

                    }

                />

                <span>

                    {speed}x

                </span>

            </div>

        </Card>

    );

}