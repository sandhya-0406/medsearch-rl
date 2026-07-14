import {

useLocation

} from

"react-router-dom";

const names={

"/":"Dashboard",

"/upload":"Upload Center",

"/analytics":"Analytics",

"/explorer":"Agent Explorer",

"/replay":"Replay Studio",

"/classification":"Classification",

"/heatmaps":"Heatmaps",

"/comparison":"Comparison",

"/playground":"Playground",

"/settings":"Settings"

};

export default function useBreadcrumbs(){

const{

pathname

}=useLocation();

const current=

names[pathname]||

"Dashboard";

return[

{

label:"Dashboard",

path:"/"

},

...(pathname!=="/"

?[

{

label:current,

path:pathname

}

]

:[]

)

];

}