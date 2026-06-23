import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";

export default function App(){

    return(

        <ThemeProvider>

            <Navbar/>

            <Dashboard/>

        </ThemeProvider>

    );

}