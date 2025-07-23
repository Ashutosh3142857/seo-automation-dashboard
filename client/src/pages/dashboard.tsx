import StatsOverview from "@/components/seo/stats-overview";
import ToolGrid from "@/components/seo/tool-grid";
import RankingChart from "@/components/charts/ranking-chart";
import TrafficChart from "@/components/charts/traffic-chart";

export default function Dashboard() {
  return (
    <div>
      <StatsOverview />
      <ToolGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankingChart />
        <TrafficChart />
      </div>
    </div>
  );
}
