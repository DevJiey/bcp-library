import { FaTags } from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import MasterDataManager from "../../components/MasterDataManager";
import categories from "../../data/categories";

function Categories() {
  return (
    <AdminLayout>
      <MasterDataManager
        title="Category Management"
        subtitle="Organize library books using catalog categories."
        sectionLabel="Catalog Organization"
        itemLabel="Category"
        icon={<FaTags />}
        initialItems={categories}
      />
    </AdminLayout>
  );
}

export default Categories;