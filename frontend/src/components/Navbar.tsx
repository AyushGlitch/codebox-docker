import { NavLink, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";




function Navbar () {

    const path= useLocation().pathname
    // console.log(path)

    return (
        <nav className="flex justify-between items-center mx-5 my-3">
            <div>
                <h1 className="text-2xl font-semibold">CodeBox</h1>
            </div>

            <div className="flex gap-4">
                <Button variant={"secondary"} className={cn("text-base border-b-4 rounded-xl p-5", path=='/'?'border-b-white' :'')} asChild>
                    <NavLink to={'/'} >Home</NavLink>
                </Button>

                <Button variant={"secondary"} className={cn("text-base border-b-4 rounded-xl p-5", path=='/coding'?'border-b-white' :'')} asChild>
                    <NavLink to={'/coding'} >Coding</NavLink>
                </Button>
            </div>

            <div className="w-1/12">
            </div>
        </nav>
    )
}

export default Navbar;