import { useState } from "react";

import { useUpload } from "../../context/UploadContext";

import ViewerToolbar from "./ViewToolbar";

import ImageMetadata from "./ImageMetadata";

export default function UploadPreview(){

const{

preview

}=useUpload();

const[zoom,setZoom]=useState(1);

return(

<div
className="
elevated-card
rounded-[28px]
p-6
"
>

<div
className="
flex
justify-between
items-center
mb-6
"
>

<h2
className="
text-2xl
font-bold
"
>

Medical Image Viewer

</h2>

<div
className="
text-xs
px-3
py-2
rounded-full
bg-cyan-500/10
text-cyan-400
"
>

Viewer Ready

</div>

</div>

<ViewerToolbar

zoom={zoom}

setZoom={setZoom}

/>

<div

className="
rounded-3xl
overflow-hidden
aspect-square
flex
items-center
justify-center
"

style={{

background:"var(--surface-2)"

}}

>

{

preview

?

<img

src={preview}

alt="preview"

style={{

transform:`scale(${zoom})`,

transition:"0.25s"

}}

className="
max-w-full
max-h-full
object-contain
"
/>

:

<div

style={{

color:"var(--muted)"

}}

>

No Image Selected

</div>

}

</div>

<ImageMetadata

zoom={zoom}

/>

</div>

)

}