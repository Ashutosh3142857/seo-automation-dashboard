import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Search, 
  TrendingUp, 
  AlertCircle, 
  Globe,
  BarChart3,
  Eye,
  Link as LinkIcon
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function CompetitorAnalysis() {
  const [competitorDomain, setCompetitorDomain] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const websiteId = 1; // Default website ID

  const { data: analyses, isLoading } = useQuery({
    queryKey: ["/api/competitors", websiteId],
    queryFn: () => api.getCompetitorAnalysisByWebsiteId?.(websiteId) || Promise.resolve([]),
  });

  // Mock competitor data for demonstration
  const mockCompetitors = [
    {
      domain: "semrush.com",
      sharedKeywords: 284,
      competitorBacklinks: 15420,
      organicTraffic: "2.1M",
      topKeywords: ["SEO tools", "keyword research", "competitor analysis"],
      contentGaps: [
        "Technical SEO guides",
        "Local SEO optimization", 
        "Mobile SEO best practices"
      ]
    },
    {
      domain: "ahrefs.com", 
      sharedKeywords: 312,
      competitorBacklinks: 18950,
      organicTraffic: "3.4M",
      topKeywords: ["backlink analysis", "SEO audit", "rank tracking"],
      contentGaps: [
        "Content marketing strategies",
        "Social media SEO",
        "E-commerce SEO"
      ]
    },
    {
      domain: "moz.com",
      sharedKeywords: 198,
      competitorBacklinks: 9876,
      organicTraffic: "1.8M", 
      topKeywords: ["domain authority", "link building", "SEO metrics"],
      contentGaps: [
        "AI in SEO",
        "Voice search optimization",
        "Video SEO strategies"
      ]
    }
  ];

  const handleAnalyzeCompetitor = () => {
    if (!competitorDomain) return;
    
    toast({
      title: "Analysis Started",
      description: `Analyzing competitor: ${competitorDomain}`,
    });
    
    // In a real implementation, this would call the API
    setCompetitorDomain("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Competitor Analysis</CardTitle>
              <p className="text-gray-600 mt-1">Analyze competitors to identify content gaps and opportunities</p>
            </div>
            <Badge className="bg-red-100 text-red-700">
              Semrush do it already
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter competitor domain (e.g., competitor.com)"
              value={competitorDomain}
              onChange={(e) => setCompetitorDomain(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyzeCompetitor}
              disabled={!competitorDomain}
              className="bg-primary hover:bg-primary/90"
            >
              <Search className="w-4 h-4 mr-2" />
              Analyze Competitor
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Competitors Tracked</p>
                <p className="text-2xl font-bold text-gray-900">{mockCompetitors.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Shared Keywords</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockCompetitors.reduce((sum, comp) => sum + comp.sharedKeywords, 0)}
                </p>
              </div>
              <Search className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Content Gaps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockCompetitors.reduce((sum, comp) => sum + comp.contentGaps.length, 0)}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Opportunities</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Competitor Analysis Results */}
      <div className="space-y-6">
        {mockCompetitors.map((competitor, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{competitor.domain}</h3>
                    <p className="text-sm text-gray-600">Organic Traffic: {competitor.organicTraffic}/month</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Shared Keywords */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Shared Keywords</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Keywords in common</span>
                      <span className="font-bold text-blue-600">{competitor.sharedKeywords}</span>
                    </div>
                    <div className="space-y-2">
                      {competitor.topKeywords.map((keyword, keywordIndex) => (
                        <div key={keywordIndex} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{keyword}</span>
                          <Badge variant="outline" className="text-xs">
                            Top 10
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Backlink Profile */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Backlink Profile</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Backlinks</span>
                      <span className="font-bold text-green-600">
                        {competitor.competitorBacklinks.toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Referring Domains</span>
                        <span className="font-medium">2,840</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Domain Rating</span>
                        <span className="font-medium">91</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">New Links/Month</span>
                        <span className="font-medium">156</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Gaps */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Content Gaps</h4>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">
                        Topics they rank for that you don't
                      </span>
                    </div>
                    <div className="space-y-2">
                      {competitor.contentGaps.map((gap, gapIndex) => (
                        <div key={gapIndex} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{gap}</span>
                          <Button size="sm" variant="outline" className="text-xs">
                            Target
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Gap Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Content Gap Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { topic: "AI-Powered SEO Tools", difficulty: 65, volume: "12K", competitors: 3 },
              { topic: "Voice Search Optimization", difficulty: 45, volume: "8.5K", competitors: 2 },
              { topic: "Core Web Vitals Guide", difficulty: 52, volume: "15K", competitors: 3 },
              { topic: "SEO for SaaS Products", difficulty: 58, volume: "6.8K", competitors: 2 },
              { topic: "Mobile-First Indexing", difficulty: 42, volume: "9.2K", competitors: 2 },
              { topic: "Schema Markup Tutorial", difficulty: 48, volume: "11K", competitors: 1 }
            ].map((opportunity, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h5 className="font-medium text-gray-900 mb-2">{opportunity.topic}</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Search Volume</span>
                    <span className="font-medium">{opportunity.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{opportunity.difficulty}%</span>
                      <Progress value={opportunity.difficulty} className="w-12 h-2" />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Competitors</span>
                    <span className="font-medium">{opportunity.competitors}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 bg-primary hover:bg-primary/90">
                  Create Content
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
