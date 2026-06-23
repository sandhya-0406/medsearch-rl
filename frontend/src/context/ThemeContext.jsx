import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {

        if(darkMode){

            document.body.classList.add("dark");

        }

        else{

            document.body.classList.remove("dark");

        }

    },[darkMode]);

    return(

        <ThemeContext.Provider
            value={{
                darkMode,
                setDarkMode
            }}
        >

            {children}

        </ThemeContext.Provider>

    );

}

export function useTheme(){

    return useContext(ThemeContext);

}