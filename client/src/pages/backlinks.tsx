import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Globe, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Backlinks() {
  const [autoApprove, setAutoApprove] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const websiteId = 1; // Default website ID

  const { data: pendingBacklinks, isLoading } = useQuery({
    queryKey: ["/api/backlinks", websiteId, "pending"],
    queryFn: () => api.getPendingBacklinks(websiteId),
  });

  const { data: allBacklinks } = useQuery({
    queryKey: ["/api/backlinks", websiteId],
    queryFn: () => api.getBacklinks(websiteId),
  });

  const updateBacklinkMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.updateBacklinkStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/backlinks"] });
      toast({
        title: "Success",
        description: "Backlink status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update backlink status",
        variant: "destructive",
      });
    },
  });

  const [discoverySettings, setDiscoverySettings] = useState({
    domain: "example.com",
    targetKeywords: ["SEO tools", "keyword research", "backlink analysis"],
    niche: "SEO/Marketing"
  });

  const discoverBacklinksMutation = useMutation({
    mutationFn: () => api.discoverBacklinkOpportunities(discoverySettings),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/backlinks"] });
      toast({
        title: "Discovery Complete",
        description: `Found ${result.opportunities?.length || 0} new backlink opportunities`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to discover backlink opportunities. Please check your OpenAI API key.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id: number) => {
    updateBacklinkMutation.mutate({ id, status: "approved" });
  };

  const handleReject = (id: number) => {
    updateBacklinkMutation.mutate({ id, status: "rejected" });
  };

  const stats = {
    thisMonth: allBacklinks?.filter(link => {
      const linkDate = new Date();
      const now = new Date();
      return linkDate.getMonth() === now.getMonth() && linkDate.getFullYear() === now.getFullYear();
    }).length || 0,
    successRate: allBacklinks ? Math.round((allBacklinks.filter(link => link.status === "approved").length / allBacklinks.length) * 100) : 0,
    avgDA: allBacklinks?.length ? Math.round(allBacklinks.reduce((sum, link) => sum + (link.domainAuthority || 0), 0) / allBacklinks.length) : 0
  };

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Automated Backlink Generation</CardTitle>
              <p className="text-gray-600 mt-1">Review and approve automatically generated backlink opportunities</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Auto-approve quality links</span>
                <Switch checked={autoApprove} onCheckedChange={setAutoApprove} />
              </div>
              <Button 
                onClick={() => discoverBacklinksMutation.mutate()}
                disabled={discoverBacklinksMutation.isPending}
              >
                {discoverBacklinksMutation.isPending ? "Discovering..." : "Discover New Links"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Pending Approvals */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">
              Pending Approvals ({pendingBacklinks?.length || 0})
            </h4>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 bg-gray-50 rounded-lg border">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : pendingBacklinks?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending backlinks to review
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBacklinks?.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Globe className="text-gray-600 h-6 w-6" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {new URL(link.sourceUrl).hostname}
                          </h5>
                          <p className="text-sm text-gray-600">
                            DA: {link.domainAuthority || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Anchor text: "{link.anchorText || "N/A"}"
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-green-100 text-green-700">High Quality</Badge>
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleApprove(link.id)}
                        disabled={updateBacklinkMutation.isPending}
                      >
                        <Check className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(link.id)}
                        disabled={updateBacklinkMutation.isPending}
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
              <h5 className="font-semibold text-blue-900 mb-2">This Month</h5>
              <p className="text-3xl font-bold text-blue-900">{stats.thisMonth}</p>
              <p className="text-sm text-blue-700 mt-1">New backlinks acquired</p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
              <h5 className="font-semibold text-green-900 mb-2">Success Rate</h5>
              <p className="text-3xl font-bold text-green-900">{stats.successRate}%</p>
              <p className="text-sm text-green-700 mt-1">Approved backlinks</p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
              <h5 className="font-semibold text-purple-900 mb-2">Domain Authority</h5>
              <p className="text-3xl font-bold text-purple-900">{stats.avgDA}</p>
              <p className="text-sm text-purple-700 mt-1">Average DA score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
