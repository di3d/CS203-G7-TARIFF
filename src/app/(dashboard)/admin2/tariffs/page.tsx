import AddTariff from "@/app/components/AddTariff";
import EditTariff from "@/app/components/EditTariff";

export default function ManageCountryPage() {
    return (
        <div className="space-y-6">
            <AddTariff/>
            <EditTariff/>
        </div>
    )
}