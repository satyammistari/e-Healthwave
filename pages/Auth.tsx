
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, User, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { registerUserOnBlockchain, authenticateUser } from '@/utils/blockchain';

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, error } = useAuth();
  
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadharNumber: '',
    role: 'patient' as 'patient' | 'doctor',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: 'patient' | 'doctor') => {
    setFormData(prev => ({ ...prev, role: value }));
  };
  
  const toggleFormType = () => {
    setIsLoginForm(prev => !prev);
  };
  
  const validateForm = () => {
    if (isLoginForm) {
      if (!formData.email || !formData.password || !formData.aadharNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return false;
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.aadharNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Validation Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return false;
      }
      
      // Validate Aadhar number (should be 12 digits)
      if (!/^\d{12}$/.test(formData.aadharNumber)) {
        toast({
          title: "Validation Error",
          description: "Aadhar number must be 12 digits",
          variant: "destructive",
        });
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isLoginForm) {
        // Simulate blockchain authentication
        const isAuthenticated = authenticateUser(formData.aadharNumber, formData.password);
        
        if (!isAuthenticated) {
          toast({
            title: "Authentication Failed",
            description: "Invalid credentials. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        await login(formData.email, formData.password, formData.aadharNumber);
        
        toast({
          title: "Login Successful",
          description: "Welcome back to eHealthWave!",
        });
        
        // Redirect based on role
        navigate(formData.email.includes('doctor') ? '/doctor' : '/patient');
      } else {
        // Register user on blockchain
        try {
          const userId = registerUserOnBlockchain(formData.aadharNumber, formData.password);
          
          if (userId) {
            await register(
              formData.name,
              formData.email,
              formData.password,
              formData.role,
              formData.aadharNumber
            );
            
            toast({
              title: "Registration Successful",
              description: "Your account has been created successfully!",
            });
            
            // Redirect based on role
            navigate(formData.role === 'doctor' ? '/doctor' : '/patient');
          }
        } catch (error: any) {
          toast({
            title: "Registration Failed",
            description: error.message || "Error creating account on blockchain",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast({
        title: "Error",
        description: error || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="w-full animate-fade-in">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                {isLoginForm ? 'Sign in to your account' : 'Create an account'}
              </CardTitle>
              <CardDescription className="text-center">
                {isLoginForm 
                  ? 'Enter your credentials to access your account' 
                  : 'Fill in your details to create a new account'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginForm && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                {!isLoginForm && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Number</Label>
                  <Input
                    id="aadharNumber"
                    name="aadharNumber"
                    placeholder="12-digit Aadhar Number"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{12}"
                    maxLength={12}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Aadhar number is used for secure blockchain authentication
                  </p>
                </div>
                
                {!isLoginForm && (
                  <div className="space-y-2">
                    <Label>I am a</Label>
                    <RadioGroup 
                      value={formData.role} 
                      onValueChange={(value) => handleRoleChange(value as 'patient' | 'doctor')}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="patient" id="patient" />
                        <Label htmlFor="patient" className="cursor-pointer">Patient</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="doctor" id="doctor" />
                        <Label htmlFor="doctor" className="cursor-pointer">Doctor</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLoginForm ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    isLoginForm ? 'Sign in' : 'Create account'
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={toggleFormType} 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {isLoginForm 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
