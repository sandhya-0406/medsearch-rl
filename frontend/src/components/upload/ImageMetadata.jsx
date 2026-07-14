import { useUpload } from "../../context/UploadContext";

export default function ImageMetadata({

zoom

}){

const{

metadata

}=useUpload();

if(!metadata) return null;

return(

<div
className="
grid
grid-cols-2
gap-5
mt-6
"
>

<Item
label="Filename"
value={metadata.name}
/>

<Item
label="Format"
value={metadata.type}
/>

<Item
label="Size"
value={`${metadata.size} MB`}
/>

<Item
label="Zoom"
value={`${Math.round(zoom*100)}%`}
/>

</div>

)

}

function Item({

label,

value

}){

return(

<div>

<p

className="text-sm"

style={{

color:"var(--muted)"

}}

>

{label}

</p>

<h4
className="
font-semibold
mt-1
break-all
"
>

{value}

</h4>

</div>

)

}