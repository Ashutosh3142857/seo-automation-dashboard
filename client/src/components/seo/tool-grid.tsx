import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Link as LinkIcon, 
  Search, 
  TrendingUp, 
  Settings, 
  MapPin, 
  Wand2 
} from "lucide-react";

const seoTools = [
  {
    name: "Backlink Generator",
    description: "Automated link building",
    icon: LinkIcon,
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
    stats: [
      { label: "Pending Review", value: "23" },
      { label: "This Week", value: "156" }
    ],
    progress: 75,
    progressColor: "bg-primary",
    buttonText: "Review Suggestions"
  },
  {
    name: "On-Page SEO",
    description: "Content optimization",
    icon: Search,
    status: "Scanning",
    statusColor: "bg-blue-100 text-blue-700",
    stats: [
      { label: "Pages Analyzed", value: "84" },
      { label: "Issues Found", value: "12" }
    ],
    progress: 88,
    progressColor: "bg-green-500",
    buttonText: "View Recommendations"
  },
  {
    name: "Rank Tracking",
    description: "SERP monitoring",
    icon: TrendingUp,
    status: "Important",
    statusColor: "bg-yellow-100 text-yellow-700",
    stats: [
      { label: "Tracked Keywords", value: "1,247" },
      { label: "Avg. Position", value: "8.3" }
    ],
    progress: 65,
    progressColor: "bg-yellow-500",
    buttonText: "Generate Report"
  },
  {
    name: "Technical Audit",
    description: "Site health check",
    icon: Settings,
    status: "Issues",
    statusColor: "bg-red-100 text-red-700",
    stats: [
      { label: "Critical Issues", value: "5" },
      { label: "Warnings", value: "18" }
    ],
    progress: 35,
    progressColor: "bg-red-500",
    buttonText: "Fix Issues"
  },
  {
    name: "Local SEO",
    description: "GMB & citations",
    icon: MapPin,
    status: "Important",
    statusColor: "bg-yellow-100 text-yellow-700",
    stats: [
      { label: "GMB Score", value: "92%" },
      { label: "Citations", value: "156" }
    ],
    progress: 92,
    progressColor: "bg-orange-500",
    buttonText: "Manage Listings"
  },
  {
    name: "AI Content",
    description: "Content optimization",
    icon: Wand2,
    status: "Ready",
    statusColor: "bg-green-100 text-green-700",
    stats: [
      { label: "Content Score", value: "78%" },
      { label: "Suggestions", value: "12" }
    ],
    progress: 78,
    progressColor: "bg-indigo-500",
    buttonText: "Optimize Content"
  }
];

export default function ToolGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {seoTools.map((tool, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <tool.icon className="text-blue-600 h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
              <Badge className={tool.statusColor}>
                {tool.status}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {tool.stats.map((stat, statIndex) => (
                <div key={statIndex} className="flex justify-between text-sm">
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-medium text-gray-900">{stat.value}</span>
                </div>
              ))}
              
              <Progress value={tool.progress} className="w-full h-2" />
              
              <Button variant="outline" className="w-full">
                {tool.buttonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
