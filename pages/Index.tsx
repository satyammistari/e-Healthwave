
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import FeaturedFunctionality from '@/components/FeaturedFunctionality';
import { UserCircle, Stethoscope, Smartphone } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      
      <div className="py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive healthcare ecosystem connecting patients, doctors, and emergency services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Patient Portal"
              description="Manage your medical records, appointments, and prescriptions"
              icon={UserCircle}
              link="/patient"
            />
            <FeatureCard 
              title="Doctor Dashboard"
              description="Efficiently manage patients, consultations and treatment plans"
              icon={Stethoscope}
              link="/doctor"
            />
            <FeatureCard 
              title="Mobile Access"
              description="Access your health data on-the-go and share with providers"
              icon={Smartphone}
              link="/mobile"
            />
          </div>
        </div>
      </div>
      
      <FeaturedFunctionality />
      
      <Footer />
    </div>
  );
};

export default Index;
