import Stats from '../../components/admin/Stats';
import PendingSubmissionsTable from "../../components/admin/PendingSubmissionsTable.tsx";
import RelationEditor from "../../components/admin/RelationEditor.tsx";
const AdminPanel = () => {
    return (
        <div>
        <div className="flex-col justify-center items-center">
            <h2>PANEL ADMINISTRATORA</h2>
        <Stats />
        </div>
        <div>
            <h2>OCZEKUJĄCE ZGŁOSZENIA UŻYTKOWNIKÓW</h2>
            <PendingSubmissionsTable />
            <h2>EDYTOR RELACJI</h2>
            <RelationEditor />
        </div>
        </div>
    )
};
export default AdminPanel;