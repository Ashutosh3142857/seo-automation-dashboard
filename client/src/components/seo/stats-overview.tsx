import { Card, CardContent } from "@/components/ui/card";
import { Key, TrendingUp, Link as LinkIcon, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function StatsOverview() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats", 1], // Using websiteId 1 as default
    queryFn: () => api.getDashboardStats(1),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Keywords",
      value: stats?.totalKeywords || 0,
      icon: Key,
      change: "+12.5%",
      changeType: "positive" as const,
      description: "vs last month",
      color: "bg-primary"
    },
    {
      title: "Avg. Position",
      value: stats?.avgPosition || 0,
      icon: TrendingUp,
      change: "-2.1",
      changeType: "positive" as const,
      description: "positions improved",
      color: "bg-green-500"
    },
    {
      title: "Backlinks",
      value: stats?.totalBacklinks || 0,
      icon: LinkIcon,
      change: "+156",
      changeType: "positive" as const,
      description: "new this week",
      color: "bg-yellow-500"
    },
    {
      title: "Organic Traffic",
      value: stats?.organicTraffic || 0,
      icon: Users,
      change: "+8.2%",
      changeType: "positive" as const,
      description: "vs last month",
      color: "bg-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`${stat.color.replace('bg-', 'text-')} h-6 w-6`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-gray-600 text-sm ml-2">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
