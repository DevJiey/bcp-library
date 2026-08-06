import { FaBuilding } from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import MasterDataManager from "../../components/MasterDataManager";
import publishers from "../../data/publishers";

function Publishers() {
  return (
    <AdminLayout>
      <MasterDataManager
        title="Publisher Management"
        sectionLabel="Catalog Organization"
        itemLabel="Publisher"
        icon={<FaBuilding />}
        initialItems={publishers}
      />
    </AdminLayout>
  );
}

export default Publishers;