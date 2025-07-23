import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function OnPageSEO() {
  const [url, setUrl] = useState("");
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const { toast } = useToast();

  const analyzePageMutation = useMutation({
    mutationFn: (pageUrl: string) => api.analyzeContent({
      websiteId: 1,
      url: pageUrl,
      targetKeywords: ["SEO", "optimization", "search engine"]
    }),
    onSuccess: (result) => {
      setAnalysisResults(prev => [result, ...prev]);
      setUrl("");
      toast({
        title: "Analysis Complete",
        description: "Page has been analyzed for SEO issues",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze page",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (url) {
      analyzePageMutation.mutate(url);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return AlertTriangle;
    return AlertTriangle;
  };

  return (
    <div className="space-y-6">
      {/* Page Analyzer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">On-Page SEO Analyzer</CardTitle>
          <p className="text-gray-600">Analyze pages for SEO optimization opportunities</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter URL to analyze (e.g., https://example.com/page)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={analyzePageMutation.isPending || !url}
              className="bg-primary hover:bg-primary/90"
            >
              <Search className="w-4 h-4 mr-2" />
              {analyzePageMutation.isPending ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analysisResults.map((result, index) => {
                const StatusIcon = getStatusIcon(result.seoScore || 0);
                return (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <StatusIcon className={`w-5 h-5 ${getScoreColor(result.seoScore || 0)}`} />
                          <h3 className="font-semibold text-gray-900">
                            {result.title || result.url}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">{result.url}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-600">SEO Score:</span>
                          <span className={`font-bold ${getScoreColor(result.seoScore || 0)}`}>
                            {result.seoScore || 0}/100
                          </span>
                        </div>
                        <Progress 
                          value={result.seoScore || 0} 
                          className="w-24 h-2" 
                        />
                      </div>
                    </div>

                    {/* SEO Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">SEO Score</p>
                        <p className={`font-semibold ${getScoreColor(result.seoScore || 0)}`}>
                          {result.seoScore || 0}/100
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">Readability</p>
                        <p className={`font-semibold ${getScoreColor(result.readabilityScore || 0)}`}>
                          {result.readabilityScore || 0}/100
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">Issues Found</p>
                        <p className="font-semibold text-orange-600">
                          {result.suggestions?.length || 0}
                        </p>
                      </div>
                    </div>

                    {/* Meta Information */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Title Tag</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {result.title || "No title found"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Meta Description</p>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {result.metaDescription || "No meta description found"}
                        </p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                        <div className="space-y-2">
                          {result.suggestions.slice(0, 5).map((suggestion: any, suggestionIndex: number) => (
                            <div key={suggestionIndex} className="flex items-start space-x-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-yellow-800">
                                  {suggestion.type?.charAt(0).toUpperCase() + suggestion.type?.slice(1) || "Issue"}
                                </p>
                                <p className="text-sm text-yellow-700">
                                  {suggestion.message || suggestion.recommendation}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pages Analyzed</p>
                <p className="text-2xl font-bold text-gray-900">{analysisResults.length}</p>
              </div>
              <Search className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analysisResults.length > 0 
                    ? Math.round(analysisResults.reduce((sum, result) => sum + (result.seoScore || 0), 0) / analysisResults.length)
                    : 0
                  }
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analysisResults.reduce((sum, result) => sum + (result.suggestions?.length || 0), 0)}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
