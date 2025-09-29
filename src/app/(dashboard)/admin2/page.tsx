import CountryDetails from "@/app/components/DefaultCountryTariffs";
import TariffsCRUD from "@/app/components/TariffsCRUD";
import axios from "axios";


export default function AdminPage() {
    return (
        <div>



                <CountryDetails/>

                <TariffsCRUD/>
        </div>
    );
}
