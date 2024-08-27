import DarkMode from "../components/DarkMode/DarkMode";
import { MdManageHistory } from "react-icons/md";

export default function Navbar() {
    return (    
        <>
            <nav className="light:bg-white dark:bg-gray-800 shadow-lg">
                <ul className="flex items-center justify-between p-4">
                    <li className="text-xl font-bold ml-5 light:text-gray-800 dark:text-gray-200">
                        Zahir Invoice
                    </li>
                    <li className="flex items-center">
                        {/* Placeholder for additional navigation items if needed */}
                    </li>
                    <li className="flex items-center">
                        <a 
                            href="/His" 
                            className="hover:text-yellow-500 text-2xl font-bold mr-5 light:text-gray-800 dark:text-gray-200"
                        >
                            <MdManageHistory />
                        </a>
                        <div className="mr-5 font-bold">
                            <DarkMode />
                        </div>
                    </li>
                </ul>
            </nav>
        </>
    );
}
