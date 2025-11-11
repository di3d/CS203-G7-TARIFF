import ManageTradeAgreements from "@/app/components/ManageTradeAgreement";
import DeleteTradeAgreement from "@/app/components/DeleteTradeAgreement";

function TradeAgreementsPage() {
    return (
        <div className="space-y-6">
            <ManageTradeAgreements />
            <DeleteTradeAgreement/>
        </div>
    );
}

export default TradeAgreementsPage;
