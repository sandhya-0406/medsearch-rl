import {

ChevronRight

}

from

"lucide-react";

import {

Link

}

from

"react-router-dom";

import

useBreadcrumbs

from

"../hooks/useBreadcrumbs";

export default function Breadcrumbs(){

const crumbs=

useBreadcrumbs();

return(

<div

className="

flex

items-center

gap-2

"

>

{

crumbs.map((crumb,index)=>(

<div

key={crumb.path}

className="

flex

items-center

gap-2

"

>

{

index>0&&

<ChevronRight

size={15}

/>

}

<Link

to={crumb.path}

className="

text-sm

font-medium

transition

hover:text-cyan-400

"

>

{crumb.label}

</Link>

</div>

))

}

</div>

)

}