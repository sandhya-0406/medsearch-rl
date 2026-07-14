import{

NavLink

}

from

"react-router-dom";

export default function NavItem({

icon:Icon,

label,

to

}){

return(

<NavLink

to={to}

className={({isActive})=>

`

flex

items-center

gap-3

px-3

py-3

rounded-xl

transition-all

${

isActive

?

"bg-cyan-500/10 text-cyan-400"

:

"hover:bg-white/5"

}

`

}

>

<Icon

size={18}

/>

<span>

{label}

</span>

</NavLink>

)

}