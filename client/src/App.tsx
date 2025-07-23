import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import Backlinks from "@/pages/backlinks";
import OnPageSEO from "@/pages/onpage-seo";
import ContentOptimizer from "@/pages/content-optimizer";
import RankTracking from "@/pages/rank-tracking";
import CompetitorAnalysis from "@/pages/competitor-analysis";
import TechnicalAudit from "@/pages/technical-audit";
import LocalSEO from "@/pages/local-seo";
import SocialMediaSEO from "@/pages/social-media-seo";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/backlinks" component={Backlinks} />
            <Route path="/onpage-seo" component={OnPageSEO} />
            <Route path="/content-optimizer" component={ContentOptimizer} />
            <Route path="/rank-tracking" component={RankTracking} />
            <Route path="/competitor-analysis" component={CompetitorAnalysis} />
            <Route path="/technical-audit" component={TechnicalAudit} />
            <Route path="/local-seo" component={LocalSEO} />
            <Route path="/social-media-seo" component={SocialMediaSEO} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
