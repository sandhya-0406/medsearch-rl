import {

RefreshCcw,

Trash2,

Expand,

Download

}

from "lucide-react";

import { useRef } from "react";

import { useUpload } from "../../context/UploadContext";

export default function UploadToolbar(){

const{

preview,

clearUpload,

setSelectedFile,

setPreview,

setMetadata

}=useUpload();

const inputRef=useRef();

function replaceImage(){

inputRef.current.click();

}

function handleChange(e){

const file=e.target.files[0];

if(!file) return;

setSelectedFile(file);

setPreview(

URL.createObjectURL(file)

);

setMetadata({

name:file.name,

size:(file.size/1024/1024).toFixed(2),

type:file.type,

uploaded:new Date().toLocaleTimeString()

});

}

function fullscreen(){

window.open(preview,"_blank");

}

function download(){

const a=document.createElement("a");

a.href=preview;

a.download="uploaded-image";

a.click();

}

return(

<>

<div

className="

flex

flex-wrap

justify-center

gap-4

mt-8

"

>

<button

onClick={replaceImage}

className="

px-5

py-3

rounded-xl

transition

hover:scale-105

"

style={{

background:"var(--surface-2)"

}}

>

<div className="flex gap-2 items-center">

<RefreshCcw size={18}/>

Replace

</div>

</button>

<button

onClick={clearUpload}

className="

px-5

py-3

rounded-xl

transition

hover:scale-105

"

style={{

background:"var(--surface-2)"

}}

>

<div className="flex gap-2 items-center">

<Trash2 size={18}/>

Remove

</div>

</button>

<button

onClick={fullscreen}

className="

px-5

py-3

rounded-xl

transition

hover:scale-105

"

style={{

background:"var(--surface-2)"

}}

>

<div className="flex gap-2 items-center">

<Expand size={18}/>

View

</div>

</button>

<button

onClick={download}

className="

px-5

py-3

rounded-xl

transition

hover:scale-105

"

style={{

background:"var(--surface-2)"

}}

>

<div className="flex gap-2 items-center">

<Download size={18}/>

Download

</div>

</button>

</div>

<input

hidden

type="file"

accept="image/*"

ref={inputRef}

onChange={handleChange}

/>

</>

);

}