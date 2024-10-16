import DarkMode from "../components/DarkMode/DarkMode";
import { MdManageHistory } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaFileInvoice } from "react-icons/fa";
import { HiDocumentPlus } from "react-icons/hi2";

export default function Navbar({ handleNewInvoice }) {
    return (
        <nav className="light:bg-white dark:bg-gray-800 shadow-lg">
            <ul className="flex items-center justify-between p-4">
                <Link 
                    to="/"
                    className="text-2xl font-bold ml-5 light:text-gray-800 dark:text-gray-200 flex items-center">
                    <FaFileInvoice className="text-3xl mr-3"/> Invoice Generator
                </Link>
                <li className="flex items-center">
                <HiDocumentPlus onClick={() => { handleNewInvoice(); window.location.href = '/'; }}  className="hover:text-yellow-500 text-2xl font-bold mr-5 light:text-gray-800 dark:text-gray-200" />
                    {/* Invoice History Link */}
                    <Link 
                        to="/history" 
                        className="hover:text-yellow-500 text-2xl font-bold mr-5 light:text-gray-800 dark:text-gray-200"
                    >
                        <MdManageHistory />
                    </Link>

                    {/* Dark Mode Toggle */}
                    <div className="mr-5 font-bold">
                        <DarkMode />
                    </div>

                    {/* Create New Invoice Button */}
                </li>
            </ul>
        </nav>
    );
}
