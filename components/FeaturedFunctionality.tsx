
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bluetooth, AlertTriangle, Shield, Smartphone } from 'lucide-react';

const FeaturedFunctionality = () => {
  return (
    <div className="py-16 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform offers cutting-edge capabilities to enhance patient care and emergency response
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5 pb-2">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-center">Mobile Health Sharing</CardTitle>
              <CardDescription className="text-center">
                View and share your health data via Bluetooth
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Bluetooth className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Connect with nearby healthcare devices</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Secure encrypted data transmission</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/mobile">Try Mobile View</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="bg-blue-500/5 pb-2">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <CardTitle className="text-center">AI Consistency Checks</CardTitle>
              <CardDescription className="text-center">
                Intelligent detection of record inconsistencies
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span>Flag duplicate prescriptions automatically</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span>Detect potential medication interactions</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/mobile">See in Mobile View</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="bg-red-500/5 pb-2">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-center">Emergency Access</CardTitle>
              <CardDescription className="text-center">
                One-time PIN access for emergency situations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>Generate temporary access PINs</span>
                </li>
                <li className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>Time-limited critical data access</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-500">
                <Link to="/emergency">Emergency Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FeaturedFunctionality;
