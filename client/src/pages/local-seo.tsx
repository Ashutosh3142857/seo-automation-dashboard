import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Star, 
  Phone, 
  Clock,
  Building,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Globe
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function LocalSEO() {
  const [businessData, setBusinessData] = useState({
    name: "Acme Digital Marketing",
    address: "123 Main St, New York, NY 10001",
    phone: "(555) 123-4567"
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const websiteId = 1; // Default website ID

  const { data: localData, isLoading } = useQuery({
    queryKey: ["/api/local-seo", websiteId],
    queryFn: () => Promise.resolve(null), // Mock implementation
  });

  // Mock local SEO data
  const mockLocalData = {
    gmbScore: 92,
    citations: 156,
    reviews: 47,
    averageRating: 4.6,
    businessName: businessData.name,
    address: businessData.address,
    phone: businessData.phone,
    listings: [
      { platform: "Google My Business", status: "verified", score: 95 },
      { platform: "Bing Places", status: "claimed", score: 88 },
      { platform: "Apple Maps", status: "pending", score: 0 },
      { platform: "Facebook", status: "verified", score: 92 },
      { platform: "Yelp", status: "verified", score: 89 },
      { platform: "Yellow Pages", status: "claimed", score: 76 }
    ],
    citationIssues: [
      { platform: "YellowPages", issue: "Inconsistent phone number", severity: "medium" },
      { platform: "Foursquare", issue: "Missing business hours", severity: "low" },
      { platform: "TripAdvisor", issue: "Outdated address", severity: "high" }
    ],
    keywordRankings: [
      { keyword: "digital marketing agency NYC", position: 3, change: 2 },
      { keyword: "SEO services New York", position: 7, change: -1 },
      { keyword: "local marketing consultant", position: 12, change: 5 },
      { keyword: "PPC management NYC", position: 15, change: 0 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-700";
      case "claimed":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-400 bg-red-50 text-red-800";
      case "medium":
        return "border-yellow-400 bg-yellow-50 text-yellow-800";
      case "low":
        return "border-blue-400 bg-blue-50 text-blue-800";
      default:
        return "border-gray-400 bg-gray-50 text-gray-800";
    }
  };

  const getPositionChange = (change: number) => {
    if (change > 0) return { icon: TrendingUp, color: "text-green-600" };
    if (change < 0) return { icon: TrendingUp, color: "text-red-600" };
    return { icon: TrendingUp, color: "text-gray-600" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Local SEO Management</CardTitle>
              <p className="text-gray-600 mt-1">Manage your Google My Business, citations, and local rankings</p>
            </div>
            <Badge className="bg-yellow-100 text-yellow-700">
              Important
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <Input
                value={businessData.name}
                onChange={(e) => setBusinessData({...businessData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <Input
                value={businessData.address}
                onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <Input
                value={businessData.phone}
                onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
              />
            </div>
          </div>
          <Button className="mt-4 bg-primary hover:bg-primary/90">
            Update Business Information
          </Button>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">GMB Score</p>
                <p className="text-2xl font-bold text-green-600">{mockLocalData.gmbScore}%</p>
              </div>
              <Building className="w-8 h-8 text-green-500" />
            </div>
            <Progress value={mockLocalData.gmbScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Citations</p>
                <p className="text-2xl font-bold text-gray-900">{mockLocalData.citations}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{mockLocalData.reviews}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Rating</p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold text-gray-900">{mockLocalData.averageRating}</p>
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Directory Listings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Directory Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockLocalData.listings.map((listing, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{listing.platform}</h4>
                  <Badge className={getStatusColor(listing.status)}>
                    {listing.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion Score</span>
                    <span className="font-medium">{listing.score}%</span>
                  </div>
                  <Progress value={listing.score} className="h-2" />
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    View
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Citation Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Citation Issues ({mockLocalData.citationIssues.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLocalData.citationIssues.map((issue, index) => (
              <div 
                key={index}
                className={`p-4 border-l-4 rounded-r-lg ${getSeverityColor(issue.severity)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{issue.platform}</h4>
                    <p className="text-sm mt-1">{issue.issue}</p>
                  </div>
                  <div className="flex items-center space-x-2">
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
                    <Button size="sm" variant="outline">
                      Fix
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Local Keyword Rankings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Local Keyword Rankings
            </CardTitle>
            <Button variant="outline" size="sm">
              Add Keywords
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-900">Keyword</th>
                  <th className="text-center py-3 font-medium text-gray-900">Position</th>
                  <th className="text-center py-3 font-medium text-gray-900">Change</th>
                  <th className="text-center py-3 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockLocalData.keywordRankings.map((keyword, index) => {
                  const changeData = getPositionChange(keyword.change);
                  const ChangeIcon = changeData.icon;
                  
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4">
                        <span className="font-medium text-gray-900">{keyword.keyword}</span>
                      </td>
                      <td className="text-center py-4">
                        <span className="text-lg font-bold text-gray-900">#{keyword.position}</span>
                      </td>
                      <td className="text-center py-4">
                        <div className="flex items-center justify-center space-x-1">
                          <ChangeIcon className={`w-4 h-4 ${changeData.color}`} />
                          <span className={`text-sm font-medium ${changeData.color}`}>
                            {keyword.change === 0 ? "—" : Math.abs(keyword.change)}
                          </span>
                        </div>
                      </td>
                      <td className="text-center py-4">
                        <Button size="sm" variant="outline">
                          Optimize
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <Building className="w-5 h-5 mb-2 text-primary" />
            <p className="font-medium">Update GMB</p>
            <p className="text-sm text-gray-600">Sync business info</p>
          </div>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <Star className="w-5 h-5 mb-2 text-yellow-500" />
            <p className="font-medium">Request Reviews</p>
            <p className="text-sm text-gray-600">Send review invites</p>
          </div>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <Globe className="w-5 h-5 mb-2 text-blue-500" />
            <p className="font-medium">Build Citations</p>
            <p className="text-sm text-gray-600">Submit to directories</p>
          </div>
        </Button>
        
        <Button variant="outline" className="h-auto p-4 justify-start">
          <div className="text-left">
            <AlertTriangle className="w-5 h-5 mb-2 text-orange-500" />
            <p className="font-medium">Fix Issues</p>
            <p className="text-sm text-gray-600">Resolve data conflicts</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
