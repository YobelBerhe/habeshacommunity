import AdminLayout from "@/components/AdminLayout";
import AdminMetrics from "@/components/AdminMetrics";

export default function AdminMetricsPage() {
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Analytics</h1>
        <p className="text-gray-600 mb-6">Monitor platform revenue and mentor performance</p>
        <AdminMetrics />
      </div>
    </AdminLayout>
  );
}
