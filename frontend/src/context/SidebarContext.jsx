import {
    createContext,
    useContext,
    useState
} from "react";

const SidebarContext = createContext();

export function SidebarProvider({

    children

}){

    const [

        collapsed,

        setCollapsed

    ] = useState(false);

    return(

        <SidebarContext.Provider

            value={{

                collapsed,

                setCollapsed

            }}

        >

            {children}

        </SidebarContext.Provider>

    )

}

export function useSidebar(){

    return useContext(SidebarContext);

}