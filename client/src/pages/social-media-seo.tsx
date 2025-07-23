import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Youtube,
  TrendingUp,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SocialMediaSEO() {
  const [postContent, setPostContent] = useState("");
  const [autoPost, setAutoPost] = useState(true);
  const { toast } = useToast();

  // Mock social media data
  const socialAccounts = [
    { platform: "Facebook", connected: true, followers: "12.4K", icon: Facebook, color: "text-blue-600" },
    { platform: "Twitter", connected: true, followers: "8.9K", icon: Twitter, color: "text-blue-400" },
    { platform: "LinkedIn", connected: true, followers: "5.2K", icon: Linkedin, color: "text-blue-700" },
    { platform: "Instagram", connected: false, followers: "15.6K", icon: Instagram, color: "text-pink-500" },
    { platform: "YouTube", connected: false, followers: "3.1K", icon: Youtube, color: "text-red-600" }
  ];

  const scheduledPosts = [
    {
      id: 1,
      content: "New blog post: 'The Ultimate Guide to Technical SEO in 2024' - Learn how to optimize your website...",
      platform: "LinkedIn",
      scheduledFor: "2024-01-15 10:00 AM",
      status: "scheduled",
      keywords: ["SEO", "Technical SEO", "Website Optimization"]
    },
    {
      id: 2,
      content: "Just published: 5 essential SEO tools every marketer should know about. What's your favorite? #SEO #DigitalMarketing",
      platform: "Twitter",
      scheduledFor: "2024-01-15 2:30 PM", 
      status: "scheduled",
      keywords: ["SEO Tools", "Digital Marketing", "Marketing"]
    },
    {
      id: 3,
      content: "Check out our latest case study showing 150% increase in organic traffic using advanced keyword strategies.",
      platform: "Facebook",
      scheduledFor: "2024-01-16 9:00 AM",
      status: "draft",
      keywords: ["Case Study", "Organic Traffic", "Keywords"]
    }
  ];

  const socialMetrics = [
    { metric: "Total Reach", value: "45.2K", change: "+12.5%", positive: true },
    { metric: "Engagement Rate", value: "4.8%", change: "+0.7%", positive: true },
    { metric: "Click-through Rate", value: "2.3%", change: "-0.2%", positive: false },
    { metric: "Social Traffic", value: "1.8K", change: "+18.9%", positive: true }
  ];

  const handleCreatePost = () => {
    if (!postContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter post content",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post Created",
      description: "Your post has been optimized and scheduled for publishing",
    });
    setPostContent("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Social Media SEO Integration</CardTitle>
              <p className="text-gray-600 mt-1">Optimize and schedule social media posts for better SEO performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Auto-post optimized content</span>
                <Switch checked={autoPost} onCheckedChange={setAutoPost} />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Social Media Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {socialMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.metric}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <Share2 className="w-8 h-8 text-primary" />
              </div>
              <div className="flex items-center mt-4">
                <TrendingUp className={`w-4 h-4 mr-1 ${metric.positive ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-sm font-medium ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </span>
                <span className="text-gray-600 text-sm ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Creator */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Create Optimized Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post Content</label>
                <Textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Write your post content here. Include relevant keywords and hashtags for better SEO..."
                  className="h-32 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Keywords</label>
                <Input placeholder="Enter keywords separated by commas" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {socialAccounts.filter(account => account.connected).map((account, index) => (
                    <Badge key={index} variant="outline" className="flex items-center space-x-1">
                      <account.icon className={`w-3 h-3 ${account.color}`} />
                      <span>{account.platform}</span>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCreatePost} className="bg-primary hover:bg-primary/90">
                  <Share2 className="w-4 h-4 mr-2" />
                  Optimize & Schedule
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Social Accounts */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialAccounts.map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <account.icon className={`w-5 h-5 ${account.color}`} />
                      <div>
                        <p className="font-medium text-gray-900">{account.platform}</p>
                        <p className="text-sm text-gray-600">{account.followers} followers</p>
                      </div>
                    </div>
                    {account.connected ? (
                      <Badge className="bg-green-100 text-green-700">Connected</Badge>
                    ) : (
                      <Button size="sm" variant="outline">Connect</Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scheduled Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Scheduled & Draft Posts ({scheduledPosts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                      <span className="text-sm text-gray-600">{post.platform}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{post.scheduledFor}</span>
                    </div>
                    <p className="text-gray-900 mb-2">{post.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {post.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {post.status === "published" && (
                  <div className="flex items-center space-x-6 text-sm text-gray-600 pt-3 border-t">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>1.2K views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>84 likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>12 comments</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">SEO Integration Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Content Optimization</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Auto-add SEO keywords</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Generate hashtags</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Optimize post timing</span>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Link Building</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Include website links</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Track social backlinks</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Monitor brand mentions</span>
                  <Switch />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
