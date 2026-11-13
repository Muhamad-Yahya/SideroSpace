import MissionIntelligenceDashboard from "@/components/MissionIntelligenceDashboard";
import { getDashboardAnalytics } from "@/lib/dashboard-analytics";

export default async function DashboardPage() {
  const analytics = await getDashboardAnalytics();
  return <MissionIntelligenceDashboard analytics={analytics} />;
}