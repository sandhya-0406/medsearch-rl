export default function StatusBadge({
    label,
    color="var(--success)"
}){

return(

<div
className="
inline-flex
items-center
gap-2
px-4
py-2
rounded-full
"
style={{
background:`${color}22`
}}
>

<div
className="
w-2
h-2
rounded-full
"
style={{
background:color
}}
/>

<span
style={{
color
}}
>
{label}
</span>

</div>

);

}