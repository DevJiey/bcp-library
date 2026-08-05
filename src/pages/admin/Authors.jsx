import { FaUserEdit } from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import MasterDataManager from "../../components/MasterDataManager";
import authors from "../../data/authors";

function Authors() {
  return (
    <AdminLayout>
      <MasterDataManager
        title="Author Management"
        subtitle="Maintain the authors associated with library catalog records."
        sectionLabel="Catalog Organization"
        itemLabel="Author"
        icon={<FaUserEdit />}
        initialItems={authors}
      />
    </AdminLayout>
  );
}

export default Authors;