export default function PrimaryButton({
children
}){

return(

<button
className="
px-8
py-4
rounded-2xl
font-semibold
text-white
transition
hover:scale-105
"
style={{
background:
"linear-gradient(135deg,#22d3ee,#8b5cf6)"
}}
>

{children}

</button>

);

}