import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, BarChart3, Download, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function RankTracking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: trackingData, isLoading } = useQuery({
    queryKey: ["/api/rank-tracking", 1],
    queryFn: () => api.getRankTracking(1),
  });

  const keywords = trackingData?.keywords || [];

  const updateRankingsMutation = useMutation({
    mutationFn: () => api.updateRankings({ websiteId: 1 }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/rank-tracking"] });
      toast({
        title: "Rankings Updated",
        description: `Updated ${result.updates?.length || 0} keyword rankings successfully`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update rankings. Please check your API configuration.",
        variant: "destructive",
      });
    },
  });

  const getPositionChange = (current: number | null, previous: number | null) => {
    if (!current || !previous) return 0;
    return previous - current; // Positive means improvement (lower position number)
  };

  const getPositionIcon = (change: number) => {
    if (change > 0) return TrendingUp;
    if (change < 0) return TrendingDown;
    return Minus;
  };

  const getPositionColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getPositionBadge = (position: number | null) => {
    if (!position) return { color: "bg-gray-100 text-gray-700", text: "N/A" };
    if (position <= 3) return { color: "bg-green-100 text-green-700", text: "Top 3" };
    if (position <= 10) return { color: "bg-yellow-100 text-yellow-700", text: "Page 1" };
    if (position <= 20) return { color: "bg-orange-100 text-orange-700", text: "Page 2" };
    return { color: "bg-red-100 text-red-700", text: "Page 3+" };
  };

  const avgPosition = keywords?.length 
    ? keywords.reduce((sum: number, k: any) => sum + (k.currentPosition || 0), 0) / keywords.length 
    : 0;

  const topPositions = keywords?.filter((k: any) => k.currentPosition && k.currentPosition <= 10).length || 0;
  const totalTracked = keywords?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Rank Tracking</CardTitle>
              <p className="text-gray-600 mt-1">Monitor keyword rankings and SERP performance</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Export Started",
                    description: "Rank tracking report is being generated...",
                  });
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button 
                onClick={() => updateRankingsMutation.mutate()}
                disabled={updateRankingsMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${updateRankingsMutation.isPending ? 'animate-spin' : ''}`} />
                {updateRankingsMutation.isPending ? "Updating..." : "Update Rankings"}
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => {
                  toast({
                    title: "Report Generated",
                    description: "Comprehensive ranking report is ready for review",
                  });
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Keywords</p>
                <p className="text-2xl font-bold text-gray-900">{totalTracked}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Position</p>
                <p className="text-2xl font-bold text-gray-900">{avgPosition.toFixed(1)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top 10 Rankings</p>
                <p className="text-2xl font-bold text-gray-900">{topPositions}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTracked > 0 ? Math.round((topPositions / totalTracked) * 100) : 0}%
                </p>
              </div>
              <Progress value={totalTracked > 0 ? (topPositions / totalTracked) * 100 : 0} className="w-8 h-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keywords Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Keyword Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-4 border rounded">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : keywords?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No keywords being tracked. Add keywords to start monitoring rankings.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 font-medium text-gray-900">Keyword</th>
                    <th className="text-center py-3 font-medium text-gray-900">Current Position</th>
                    <th className="text-center py-3 font-medium text-gray-900">Change</th>
                    <th className="text-center py-3 font-medium text-gray-900">Search Volume</th>
                    <th className="text-center py-3 font-medium text-gray-900">Difficulty</th>
                    <th className="text-center py-3 font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords?.map((keyword: any) => {
                    const change = getPositionChange(keyword.currentPosition, keyword.previousPosition);
                    const PositionIcon = getPositionIcon(change);
                    const positionBadge = getPositionBadge(keyword.currentPosition);
                    
                    return (
                      <tr key={keyword.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-gray-900">{keyword.keyword}</p>
                            {keyword.targetUrl && (
                              <p className="text-sm text-gray-600">{keyword.targetUrl}</p>
                            )}
                          </div>
                        </td>
                        <td className="text-center py-4">
                          <span className="text-lg font-bold text-gray-900">
                            {keyword.currentPosition || "—"}
                          </span>
                        </td>
                        <td className="text-center py-4">
                          <div className="flex items-center justify-center space-x-1">
                            <PositionIcon 
                              className={`w-4 h-4 ${getPositionColor(change)}`} 
                            />
                            <span className={`text-sm font-medium ${getPositionColor(change)}`}>
                              {change === 0 ? "—" : Math.abs(change)}
                            </span>
                          </div>
                        </td>
                        <td className="text-center py-4">
                          <span className="text-gray-900">
                            {keyword.searchVolume?.toLocaleString() || "—"}
                          </span>
                        </td>
                        <td className="text-center py-4">
                          <div className="flex items-center justify-center">
                            {keyword.difficulty ? (
                              <>
                                <span className="text-gray-900 mr-2">{keyword.difficulty}%</span>
                                <Progress value={keyword.difficulty} className="w-16 h-2" />
                              </>
                            ) : (
                              "—"
                            )}
                          </div>
                        </td>
                        <td className="text-center py-4">
                          <Badge className={positionBadge.color}>
                            {positionBadge.text}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
