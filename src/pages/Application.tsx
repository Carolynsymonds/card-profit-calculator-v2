import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Package, Plus, Search, Bell, Settings, BarChart3, TrendingUp, Calendar, DollarSign, Warehouse, ChefHat, Trash2, Calculator, ClipboardList, CheckCircle2, BookOpen } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import MetricCard from "@/components/MetricCard";
import ProfitByMenuCategory from "@/components/ProfitByMenuCategory";
import { OnboardingModal } from "@/components/OnboardingModal";
import { supabase } from "@/integrations/supabase/client";
import { siteContent } from "@/config/site-content";

const Application = () => {
  
  const [learningData] = useState([
    { id: 1, name: "AI Fundamentals", progress: 85, status: "completed", lastAccessed: "2 mins ago" },
    { id: 2, name: "Use Case Library", progress: 60, status: "in-progress", lastAccessed: "5 mins ago" },
    { id: 3, name: "Hands-On Exercises", progress: 30, status: "not-started", lastAccessed: "1 hour ago" },
    { id: 4, name: "Neural Networks & NLP", progress: 75, status: "in-progress", lastAccessed: "10 mins ago" },
    { id: 5, name: "Prompt Engineering", progress: 100, status: "completed", lastAccessed: "15 mins ago" }
  ]);

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

 useEffect(() => {
    const checkUserAccess = () => {
      // Get user ID from local storage
      
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        console.log('No user ID found in localStorage, redirecting to home');
        window.location.href = '/login';
        return;
      }

      // Show onboarding modal by default
      setShowOnboarding(true);
    };

    checkUserAccess();
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowSuccessModal(true);
  };

  const handleRedirectToPreview = () => {
    window.location.href = '/';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "not-started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-white border-l border-border">
          <DashboardHeader />
          <div className="p-6">
            {/* Learning Progress Overview */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground">Your AI Learning Journey</h2>
              <p className="text-sm text-muted-foreground">Track your progress through AI training modules and certifications</p>
            </div>
            
            {/* Progress Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
              <MetricCard 
                title="Modules Completed" 
                value="3" 
                change="+1 this week" 
              />
              <MetricCard 
                title="Learning Hours" 
                value="24.5" 
                change="+2.5 hours" 
              />
              <MetricCard 
                title="Exercises Done" 
                value="12" 
                change="+3 exercises" 
              />
              <MetricCard 
                title="Certificate Progress" 
                value="75%" 
                change="+15% this week" 
              />
            </div>
            
            {/* Learning Modules Progress */}
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    AI Training Modules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {learningData.map((module) => (
                      <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{module.name}</h3>
                            <Badge variant="secondary" className={getStatusColor(module.status)}>
                              {module.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${module.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{module.progress}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Last accessed: {module.lastAccessed}</p>
                        </div>
                        <Button variant="outline" size="sm" className="ml-4">
                          {module.status === 'completed' ? 'Review' : 'Continue'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          
          </div>
        </main>
      </div>
      
      <OnboardingModal 
        open={showOnboarding} 
        onComplete={handleOnboardingComplete} 
      />
      
      {/* Success Modal for completed onboarding */}
      <Dialog open={showSuccessModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-lg" hideClose={true}>
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/2e99a370-05f4-42a5-b858-54d63e59a77c.png" 
                alt="Tick" 
                className="w-32 h-32"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">You're All Set!</h3>
              <p className="text-sm text-muted-foreground">Your {siteContent.brand.name} AI training dashboard is ready.</p>
              <p className="text-sm text-muted-foreground">Start your journey with AI fundamentals and progress through hands-on exercises to earn your certification.</p>
              <p className="text-sm text-muted-foreground">Join our community and transform your restaurant with AI skills.</p>
            </div>
            <Button onClick={handleRedirectToPreview} className="w-full">
                         Continue learning about what's next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Application;