
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, Heart, Shield, Activity } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/auth';
    return user.role === 'doctor' ? '/doctor' : '/patient';
  };

  return (
    <div className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/5 to-transparent -z-10" />
      <div className="absolute top-1/3 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-blue-50 to-transparent rounded-full blur-3xl -z-10" />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <span>Revolutionizing Healthcare with AI & Blockchain</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 animate-slide-up">
            Secure, Intelligent Healthcare for Everyone
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Experience a seamless healthcare journey with our AI-powered platform. 
            Connect with doctors, manage your health records securely with blockchain, 
            and access personalized health insights - all in one place.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-6 h-auto text-lg" 
              onClick={() => navigate(getDashboardLink())}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'} 
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="px-6 py-6 h-auto text-lg border-primary/20 hover:bg-primary/5"
              onClick={() => navigate('/auth')}
            >
              {isAuthenticated ? 'View Health Records' : 'Learn More'}
            </Button>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Blockchain Security</h3>
            <p className="text-muted-foreground text-sm">
              Your health data is secured with advanced blockchain technology, ensuring privacy and preventing unauthorized access.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI Health Insights</h3>
            <p className="text-muted-foreground text-sm">
              Get personalized health recommendations and early disease detection with our advanced AI algorithms.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">Seamless Experience</h3>
            <p className="text-muted-foreground text-sm">
              Connect with doctors, manage prescriptions, and access your health records - all through a single, intuitive interface.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
