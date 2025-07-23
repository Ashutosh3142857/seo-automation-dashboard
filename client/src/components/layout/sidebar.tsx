import { Link, useLocation } from "wouter";
import { 
  BarChart3, 
  Link as LinkIcon, 
  Search, 
  Wand2, 
  TrendingUp, 
  Users, 
  Settings, 
  MapPin, 
  Share2,
  ChartLine,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Backlink Generator", href: "/backlinks", icon: LinkIcon, badge: "Auto", badgeColor: "bg-green-500" },
  { name: "On-Page SEO", href: "/onpage-seo", icon: Search },
  { name: "Content Optimizer", href: "/content-optimizer", icon: Wand2 },
  { name: "Rank Tracking", href: "/rank-tracking", icon: TrendingUp, badge: "Important", badgeColor: "bg-yellow-500" },
  { name: "Competitor Analysis", href: "/competitor-analysis", icon: Users },
  { name: "Technical Audit", href: "/technical-audit", icon: Settings },
  { name: "Local SEO", href: "/local-seo", icon: MapPin, badge: "Important", badgeColor: "bg-yellow-500" },
  { name: "Social Media SEO", href: "/social-media-seo", icon: Share2 },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ChartLine className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SEO Master</h1>
            <p className="text-sm text-gray-600">Automation Suite</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}>
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className={cn(
                    "ml-auto text-white text-xs px-2 py-1 rounded-full font-medium",
                    item.badgeColor
                  )}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="text-gray-600 h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">John Smith</p>
            <p className="text-xs text-gray-600">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
