import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SEO Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor and automate your SEO performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
          <div className="relative">
            <Bell className="text-gray-400 h-6 w-6 cursor-pointer hover:text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
