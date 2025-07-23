import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wand2, Save, Plus, AlertTriangle, Lightbulb, Check, X } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ContentOptimizer() {
  const [title, setTitle] = useState("Best SEO Tools for 2024: Complete Guide");
  const [content, setContent] = useState(`In the ever-evolving world of search engine optimization, having the right tools can make the difference between ranking on page one or getting lost in the digital void. This comprehensive guide will explore the best SEO tools available in 2024, helping you choose the perfect arsenal for your digital marketing strategy.

When it comes to keyword research, tools like SEMrush and Ahrefs have consistently proven their worth. These platforms offer comprehensive keyword databases, competitor analysis, and tracking capabilities that are essential for any serious SEO campaign...`);
  const [targetKeywords, setTargetKeywords] = useState(["SEO tools", "keyword research", "backlink analysis"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const { toast } = useToast();

  const analyzeContentMutation = useMutation({
    mutationFn: () => api.analyzeContent({
      websiteId: 1,
      content,
      title,
      targetKeywords
    }),
    onSuccess: (result) => {
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Content has been analyzed for SEO optimization",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze content",
        variant: "destructive",
      });
    },
  });

  const generateContentMutation = useMutation({
    mutationFn: (data: { topic: string; keywords: string[] }) => 
      api.generateContent({
        topic: data.topic,
        targetKeywords: data.keywords,
        contentType: "blog_post",
        wordCount: 800
      }),
    onSuccess: (result) => {
      setContent(result.content);
      toast({
        title: "Content Generated",
        description: "AI-optimized content has been generated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate content. Please check your OpenAI API key.",
        variant: "destructive",
      });
    },
  });

  const optimizeContentMutation = useMutation({
    mutationFn: () => api.optimizeContent({
      content,
      targetKeywords
    }),
    onSuccess: (result) => {
      setContent(result.optimizedContent);
      toast({
        title: "Content Optimized",
        description: "Your content has been AI-optimized for better SEO performance",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to optimize content. Please check your OpenAI API key.",
        variant: "destructive",
      });
    },
  });

  const handleAddKeyword = () => {
    if (newKeyword && !targetKeywords.includes(newKeyword)) {
      setTargetKeywords([...targetKeywords, newKeyword]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setTargetKeywords(targetKeywords.filter(k => k !== keyword));
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'keyword':
        return AlertTriangle;
      case 'readability':
        return Lightbulb;
      case 'meta':
        return Check;
      case 'links':
        return X;
      default:
        return Lightbulb;
    }
  };

  const getSuggestionColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-400 bg-red-50';
      case 'medium':
        return 'border-yellow-400 bg-yellow-50';
      case 'low':
        return 'border-blue-400 bg-blue-50';
      default:
        return 'border-green-400 bg-green-50';
    }
  };

  const getSuggestionTextColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-800';
      case 'medium':
        return 'text-yellow-800';
      case 'low':
        return 'text-blue-800';
      default:
        return 'text-green-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Content Editor */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">AI Content Optimizer</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => analyzeContentMutation.mutate()}
                  disabled={analyzeContentMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {analyzeContentMutation.isPending ? "Analyzing..." : "Optimize"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Draft Saved",
                      description: "Your content has been saved as a draft",
                    });
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2">Content Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">Target Keywords</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {targetKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-2 text-primary/70 hover:text-primary"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button onClick={handleAddKeyword} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="content" className="text-sm font-medium text-gray-700 mb-2">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-2 h-64 resize-none"
              />
            </div>

            <div className="pt-4 border-t space-y-3">
              <Button 
                onClick={() => analyzeContentMutation.mutate()}
                disabled={analyzeContentMutation.isPending}
                className="w-full"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {analyzeContentMutation.isPending ? "Analyzing..." : "Analyze Content"}
              </Button>
              
              <Button 
                onClick={() => optimizeContentMutation.mutate()}
                disabled={optimizeContentMutation.isPending || !content.trim()}
                variant="outline"
                className="w-full"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {optimizeContentMutation.isPending ? "Optimizing..." : "AI Optimize Content"}
              </Button>
              
              <Button 
                onClick={() => generateContentMutation.mutate({ 
                  topic: "Best SEO Tools for 2024", 
                  keywords: targetKeywords 
                })}
                disabled={generateContentMutation.isPending}
                variant="outline"
                className="w-full"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {generateContentMutation.isPending ? "Generating..." : "Generate AI Content"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions Panel */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold text-gray-900">AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Content Score */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">SEO Score</span>
                <span className="text-sm font-bold text-orange-600">
                  {analysisResult?.seoScore || 78}/100
                </span>
              </div>
              <Progress value={analysisResult?.seoScore || 78} className="w-full h-2" />
            </div>

            {/* Suggestions List */}
            <div className="space-y-4">
              {analysisResult?.suggestions?.length > 0 ? (
                analysisResult.suggestions.map((suggestion: any, index: number) => {
                  const Icon = getSuggestionIcon(suggestion.type);
                  return (
                    <div 
                      key={index}
                      className={`p-3 border-l-4 rounded-r-lg ${getSuggestionColor(suggestion.severity)}`}
                    >
                      <div className="flex items-start">
                        <Icon className={`${getSuggestionTextColor(suggestion.severity)} mt-1 mr-2 w-4 h-4`} />
                        <div>
                          <p className={`text-sm font-medium ${getSuggestionTextColor(suggestion.severity)}`}>
                            {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                          </p>
                          <p className={`text-xs mt-1 ${getSuggestionTextColor(suggestion.severity)}/80`}>
                            {suggestion.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="text-yellow-600 mt-1 mr-2 w-4 h-4" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Keyword Density</p>
                        <p className="text-xs text-yellow-700 mt-1">Primary keyword "SEO tools" appears 12 times (3.2%). Recommended: 1-2%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <div className="flex items-start">
                      <Lightbulb className="text-blue-600 mt-1 mr-2 w-4 h-4" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Readability</p>
                        <p className="text-xs text-blue-700 mt-1">Add more subheadings to improve content structure and readability</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                    <div className="flex items-start">
                      <Check className="text-green-600 mt-1 mr-2 w-4 h-4" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Meta Description</p>
                        <p className="text-xs text-green-700 mt-1">Length is optimal (155 characters)</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                    <div className="flex items-start">
                      <X className="text-red-600 mt-1 mr-2 w-4 h-4" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Internal Links</p>
                        <p className="text-xs text-red-700 mt-1">Add 2-3 internal links to related pages</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
              Apply All Suggestions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
