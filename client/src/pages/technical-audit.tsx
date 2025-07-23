import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Smartphone,
  Zap,
  Link as LinkIcon,
  Image,
  FileText,
  Search
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function TechnicalAudit() {
  const [auditUrl, setAuditUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const websiteId = 1; // Default website ID

  const { data: latestAudit, isLoading } = useQuery({
    queryKey: ["/api/audit", websiteId, "latest"],
    queryFn: () => api.getLatestAudit(websiteId),
  });

  const performAuditMutation = useMutation({
    mutationFn: (domain: string) => api.performAudit(websiteId, domain),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/audit"] });
      toast({
        title: "Audit Complete",
        description: "Technical SEO audit has been completed",
      });
      setAuditUrl("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to perform technical audit",
        variant: "destructive",
      });
    },
  });

  const handleRunAudit = () => {
    if (auditUrl) {
      performAuditMutation.mutate(auditUrl);
    }
  };

  // Mock audit data for demonstration
  const mockAuditData = latestAudit || {
    pageSpeed: 68,
    mobileScore: 72,
    brokenLinks: 5,
    missingAltTags: 18,
    missingMetaTags: 3,
    issues: [
      {
        type: "performance",
        severity: "high",
        message: "Large images slowing down page load",
        url: "/products/large-image.jpg"
      },
      {
        type: "accessibility", 
        severity: "medium",
        message: "18 images missing alt text",
        url: "/gallery"
      },
      {
        type: "meta",
        severity: "high", 
        message: "Missing meta description",
        url: "/about"
      },
      {
        type: "structure",
        severity: "medium",
        message: "Multiple H1 tags found",
        url: "/services"
      },
      {
        type: "mobile",
        severity: "medium",
        message: "Text too small on mobile devices",
        url: "/contact"
      }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-400 bg-red-50";
      case "medium":
        return "border-yellow-400 bg-yellow-50";
      case "low":
        return "border-blue-400 bg-blue-50";
      default:
        return "border-gray-400 bg-gray-50";
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-800";
      case "medium":
        return "text-yellow-800";
      case "low":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "performance":
        return Zap;
      case "accessibility":
        return Image;
      case "meta":
        return FileText;
      case "structure":
        return Settings;
      case "mobile":
        return Smartphone;
      default:
        return AlertTriangle;
    }
  };

  const criticalIssues = mockAuditData.issues?.filter((issue: any) => issue.severity === "high").length || 0;
  const warningIssues = mockAuditData.issues?.filter((issue: any) => issue.severity === "medium").length || 0;
  const overallScore = Math.round((
    (mockAuditData.pageSpeed || 0) + 
    (mockAuditData.mobileScore || 0)
  ) / 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Technical SEO Audit</CardTitle>
              <p className="text-gray-600 mt-1">Identify and fix technical issues affecting your site's performance</p>
            </div>
            <Badge className="bg-red-100 text-red-700">
              Issues Found
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter domain to audit (e.g., https://example.com)"
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleRunAudit}
              disabled={performAuditMutation.isPending || !auditUrl}
              className="bg-primary hover:bg-primary/90"
            >
              <Search className="w-4 h-4 mr-2" />
              {performAuditMutation.isPending ? "Auditing..." : "Run Audit"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}/100</p>
              </div>
              <div className={`w-12 h-12 ${getScoreBackground(overallScore)} rounded-lg flex items-center justify-center`}>
                <Settings className={`w-6 h-6 ${getScoreColor(overallScore)}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Speed</p>
                <p className={`text-2xl font-bold ${getScoreColor(mockAuditData.pageSpeed || 0)}`}>
                  {mockAuditData.pageSpeed || 0}/100
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mobile Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(mockAuditData.mobileScore || 0)}`}>
                  {mockAuditData.mobileScore || 0}/100
                </p>
              </div>
              <Smartphone className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{criticalIssues}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Zap className="w-5 h-5 text-yellow-500 mr-2" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Page Speed Score</span>
                <span className={`font-bold ${getScoreColor(mockAuditData.pageSpeed || 0)}`}>
                  {mockAuditData.pageSpeed || 0}/100
                </span>
              </div>
              <Progress value={mockAuditData.pageSpeed || 0} className="h-2" />
              <div className="text-sm text-gray-600">
                <p>• Large images detected</p>
                <p>• Unoptimized CSS files</p>
                <p>• Missing compression</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Image className="w-5 h-5 text-blue-500 mr-2" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Missing Alt Tags</span>
                <span className="font-bold text-orange-600">{mockAuditData.missingAltTags || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Color Contrast Issues</span>
                <span className="font-bold text-orange-600">2</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>• Images need alt text</p>
                <p>• Low contrast buttons</p>
                <p>• Missing form labels</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 text-green-500 mr-2" />
              Meta & Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Missing Meta Tags</span>
                <span className="font-bold text-red-600">{mockAuditData.missingMetaTags || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Duplicate Content</span>
                <span className="font-bold text-yellow-600">1</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>• Missing meta descriptions</p>
                <p>• Multiple H1 tags</p>
                <p>• Duplicate title tags</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Issues Found ({mockAuditData.issues?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAuditData.issues?.map((issue: any, index: number) => {
              const IssueIcon = getIssueIcon(issue.type);
              return (
                <div 
                  key={index}
                  className={`p-4 border-l-4 rounded-r-lg ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <IssueIcon className={`w-5 h-5 mt-0.5 ${getSeverityTextColor(issue.severity)}`} />
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className={`font-medium ${getSeverityTextColor(issue.severity)}`}>
                            {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)} Issue
                          </h4>
                          <Badge 
                            className={
                              issue.severity === "high" 
                                ? "bg-red-100 text-red-700"
                                : issue.severity === "medium"
                                ? "bg-yellow-100 text-yellow-700" 
                                : "bg-blue-100 text-blue-700"
                            }
                          >
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className={`text-sm ${getSeverityTextColor(issue.severity)}`}>
                          {issue.message}
                        </p>
                        {issue.url && (
                          <p className="text-xs text-gray-600 mt-1">
                            Affected URL: {issue.url}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Fix Issue
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Quick Fixes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Optimize Images</p>
                <p className="text-sm text-gray-600">Compress and resize large images</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Add Alt Text</p>
                <p className="text-sm text-gray-600">Generate alt text for images</p>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Fix Meta Tags</p>
                <p className="text-sm text-gray-600">Add missing meta descriptions</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
