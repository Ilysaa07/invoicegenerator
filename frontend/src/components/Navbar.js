import DarkMode from "../components/DarkMode/DarkMode";
import { MdManageHistory } from "react-icons/md";

export default function Navbar() {
    return (    
        <>
 <nav className="bg-white shadow-lg">
    <ul className="flex items-center justify-between p-4">
        <li className="text-xl font-bold ml-5">Zahir Invoice</li>
        <li className="flex items-center">
            
        </li>
        <li className="flex items-center">
            <a href="/History.js" className="hover:text-yellow-500 text-2xl font-bold mr-5"><MdManageHistory /></a>
            <div className="mr-5 font-bold"><DarkMode/></div>
        </li>
    </ul>
 </nav>
        </>
    )
}