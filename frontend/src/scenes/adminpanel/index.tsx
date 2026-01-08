import Stats from '../../components/admin/Stats';
import PendingSubmissionsTable from "../../components/admin/PendingSubmissionsTable.tsx";
import RelationEditor from "../../components/admin/RelationEditor.tsx";
import MaxBeefs from '../../components/admin/MaxBeefs.tsx';
import Logs from '../../components/admin/Logs.tsx';
const AdminPanel = () => {
    return (
        <div>
        <div className="flex-col justify-center items-center">
            <Stats />
        </div>
        <div>
            <MaxBeefs />
        </div>
        <div>
            <PendingSubmissionsTable />
            <RelationEditor />
            <Logs />
        </div>
        </div>
    )
};
export default AdminPanel;