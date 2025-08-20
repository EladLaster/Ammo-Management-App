import { Inventory } from "../components/Inventory";
import { Status } from "../components/Status";
import "./HomePageAdmin.css"

export function HomePageAdmin(){


    return(
        <>
        <h1>Home Page Admin</h1>
        <Status/>
        <Inventory/>
        </>
    )
}