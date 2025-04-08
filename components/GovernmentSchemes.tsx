import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileText, BadgeCheck, ArrowRight, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SchemeQuestion {
  id: string;
  question: string;
  options: string[];
}

interface SchemeEligibility {
  schemeId: string;
  questions: SchemeQuestion[];
  requiredAnswers: { [key: string]: string };
}

interface GovernmentScheme {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  eligibilityCriteria: string[];
  documents: string[];
  coverageAmount: string;
  website: string;
  status: 'eligible' | 'ineligible' | 'check-eligibility';
  progress?: number;
}

const schemes: GovernmentScheme[] = [
  {
    id: 'pmjay',
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    description: 'A health insurance scheme aiming to provide free access to healthcare for low income earners in the country.',
    benefits: [
      'Health cover of ₹5 lakhs per family per year',
      'Cashless and paperless access to healthcare services',
      'Covers pre and post hospitalization expenses',
      'No restriction on family size, age or gender',
      'Covers 3 days of pre-hospitalization and 15 days post-hospitalization expenses'
    ],
    eligibilityCriteria: [
      'Household included in the defined Socio-Economic Caste Census (SECC) 2011 list',
      'Currently enrolled under RSBY (being phased out)',
      'Families identified as deprived in rural areas',
      'Specific occupational categories in urban areas'
    ],
    documents: [
      'Aadhaar Card',
      'Ration Card',
      'Any government issued ID proof'
    ],
    coverageAmount: '₹5,00,000 per family per year',
    website: 'https://pmjay.gov.in/',
    status: 'check-eligibility'
  },
  {
    id: 'cghs',
    name: 'Central Government Health Scheme (CGHS)',
    description: 'A healthcare scheme for Central Government employees, pensioners and their families.',
    benefits: [
      'Comprehensive healthcare services including OPD and inpatient',
      'Covers all family members and dependents',
      'Access to CGHS hospitals, dispensaries and empanelled private hospitals',
      'Cashless treatment in emergencies',
      'Covers preventive health checkups'
    ],
    eligibilityCriteria: [
      'Central Government employees',
      'Central Government pensioners',
      'Members of Parliament',
      'Ex-Governors and Lt. Governors',
      'Freedom fighters',
      'Accredited journalists'
    ],
    documents: [
      'Service ID Card',
      'CGHS Beneficiary ID Card',
      'Aadhaar Card',
      'Copy of transfer order if transferred'
    ],
    coverageAmount: 'Full coverage as per CGHS rates',
    website: 'https://cghs.gov.in/',
    status: 'ineligible'
  },
  {
    id: 'jsy',
    name: 'Janani Suraksha Yojana (JSY)',
    description: 'A safe motherhood intervention to reduce maternal and neonatal mortality by promoting institutional delivery.',
    benefits: [
      'Cash assistance for delivery and post-delivery care',
      'Free ante-natal care',
      'Free institutional delivery',
      'Transportation assistance',
      'Incentives for ASHA workers'
    ],
    eligibilityCriteria: [
      'All pregnant women in Low Performing States (LPS)',
      'BPL pregnant women, SC and ST in High Performing States (HPS)',
      'Age 19 and above',
      'Up to 2 live births'
    ],
    documents: [
      'BPL card',
      'SC/ST Certificate',
      'Aadhaar Card',
      'Proof of bank account',
      'ANC registration card'
    ],
    coverageAmount: '₹1,400 in rural areas and ₹1,000 in urban areas for LPS',
    website: 'https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309',
    status: 'check-eligibility',
    progress: 35
  },
  {
    id: 'sby',
    name: 'Saubhagya Yojana (Rashtriya Swasthya Bima Yojana)',
    description: 'Health insurance scheme for BPL families providing smart card based cashless health insurance.',
    benefits: [
      'Health insurance coverage of ₹30,000 per BPL family',
      'Cashless treatment at empanelled hospitals',
      'Coverage for most diseases and conditions',
      'Transportation allowance of ₹100 per visit',
      'Pre-existing diseases covered from day one'
    ],
    eligibilityCriteria: [
      'Below Poverty Line (BPL) families as per census',
      'Unorganized sector workers',
      'MGNREGA workers who have worked for more than 15 days',
      'Domestic workers, construction workers, street vendors'
    ],
    documents: [
      'BPL card',
      'Aadhaar Card',
      'Ration Card',
      'Any government issued ID proof'
    ],
    coverageAmount: '₹30,000 per family per year',
    website: 'https://www.india.gov.in/spotlight/rashtriya-swasthya-bima-yojana',
    status: 'eligible'
  }
];

const eligibilityChecklists: { [key: string]: SchemeEligibility } = {
  pmjay: {
    schemeId: 'pmjay',
    questions: [
      {
        id: 'q1',
        question: 'Is your household included in the SECC 2011 database?',
        options: ['Yes', 'No', 'Not sure']
      },
      {
        id: 'q2',
        question: 'Do you belong to a deprived rural household as per the census?',
        options: ['Yes', 'No', 'Not sure']
      },
      {
        id: 'q3',
        question: 'What is your annual household income?',
        options: ['Less than ₹72,000', 'Between ₹72,000 and ₹2,50,000', 'Above ₹2,50,000']
      },
      {
        id: 'q4',
        question: 'Do you own a motorized vehicle?',
        options: ['Yes', 'No']
      },
      {
        id: 'q5',
        question: 'Do you own agricultural land?',
        options: ['Less than 5 acres', 'More than 5 acres', 'No agricultural land']
      }
    ],
    requiredAnswers: {
      'q1': 'Yes',
      'q3': 'Less than ₹72,000',
      'q4': 'No'
    }
  },
  jsy: {
    schemeId: 'jsy',
    questions: [
      {
        id: 'q1',
        question: 'Are you pregnant or have recently given birth?',
        options: ['Yes', 'No']
      },
      {
        id: 'q2',
        question: 'What is your age?',
        options: ['Below 19', '19 or above']
      },
      {
        id: 'q3',
        question: 'How many live births have you had previously?',
        options: ['None', 'One', 'Two or more']
      },
      {
        id: 'q4',
        question: 'Do you have a BPL card or belong to SC/ST category?',
        options: ['Yes', 'No']
      },
      {
        id: 'q5',
        question: 'In which state do you reside?',
        options: ['Low Performing State (UP, Bihar, MP, etc)', 'High Performing State (Kerala, TN, etc)']
      }
    ],
    requiredAnswers: {
      'q1': 'Yes',
      'q2': '19 or above',
      'q3': 'None',
      'q4': 'Yes'
    }
  }
};

const GovernmentSchemes: React.FC = () => {
  const { toast } = useToast();
  const [activeScheme, setActiveScheme] = useState<GovernmentScheme | null>(null);
  const [eligibilityMode, setEligibilityMode] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [applyMode, setApplyMode] = useState(false);
  const [applicationProgress, setApplicationProgress] = useState<number>(0);
  
  const handleSchemeClick = (scheme: GovernmentScheme) => {
    setActiveScheme(scheme);
    setEligibilityMode(false);
    setApplyMode(false);
  };
  
  const handleStartEligibilityCheck = () => {
    if (!activeScheme) return;
    setEligibilityMode(true);
    setAnswers({});
  };
  
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };
  
  const handleSubmitEligibility = () => {
    if (!activeScheme) return;
    
    const eligibility = eligibilityChecklists[activeScheme.id];
    if (!eligibility) {
      toast({
        title: "Cannot check eligibility",
        description: "Eligibility data not available for this scheme.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if all questions are answered
    const allQuestionsAnswered = eligibility.questions.every(q => answers[q.id]);
    if (!allQuestionsAnswered) {
      toast({
        title: "Please answer all questions",
        description: "All questions must be answered to check eligibility.",
        variant: "destructive",
      });
      return;
    }
    
    // Check eligibility criteria
    let isEligible = true;
    for (const [questionId, requiredAnswer] of Object.entries(eligibility.requiredAnswers)) {
      if (answers[questionId] !== requiredAnswer) {
        isEligible = false;
        break;
      }
    }
    
    // Update scheme status based on eligibility
    const newStatus: 'eligible' | 'ineligible' = isEligible ? 'eligible' : 'ineligible';
    
    // Update active scheme with proper type
    if (activeScheme) {
      setActiveScheme({
        ...activeScheme,
        status: newStatus
      });
    }
    
    setEligibilityMode(false);
    
    toast({
      title: isEligible ? "Eligible for scheme" : "Not eligible for scheme",
      description: isEligible 
        ? "You appear to be eligible for this scheme. You can now proceed with the application." 
        : "Based on your answers, you do not meet the eligibility criteria for this scheme.",
    });
  };
  
  const handleStartApplication = () => {
    if (!activeScheme) return;
    setApplyMode(true);
    setApplicationProgress(0);
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setApplicationProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          setTimeout(() => {
            toast({
              title: "Application submitted",
              description: "Your application has been successfully submitted. You will be notified about the status.",
            });
            
            setApplyMode(false);
          }, 500);
          
          return 100;
        }
        return newProgress;
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Government Healthcare Schemes</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((scheme) => (
          <Card 
            key={scheme.id} 
            className={`cursor-pointer transition-shadow hover:shadow-md ${
              scheme.status === 'eligible' ? 'border-green-500 border-2' : 
              scheme.status === 'ineligible' ? 'border-red-300 border' : ''
            }`}
            onClick={() => handleSchemeClick(scheme)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {scheme.name}
                </CardTitle>
                {scheme.status === 'eligible' && (
                  <Badge className="bg-green-500">
                    <BadgeCheck className="h-3 w-3 mr-1" /> Eligible
                  </Badge>
                )}
                {scheme.status === 'ineligible' && (
                  <Badge variant="outline" className="text-red-500 border-red-500">
                    Not Eligible
                  </Badge>
                )}
                {scheme.status === 'check-eligibility' && scheme.progress && (
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="mb-1">Application In Progress</Badge>
                    <Progress value={scheme.progress} className="h-1.5 w-24" />
                  </div>
                )}
              </div>
              <CardDescription>{scheme.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm">
                <p className="font-medium mb-1">Coverage: {scheme.coverageAmount}</p>
                <p className="text-muted-foreground line-clamp-2">
                  Key benefits: {scheme.benefits.slice(0, 2).join(', ')}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSchemeClick(scheme);
                }}
              >
                View Details <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Scheme Details Dialog */}
      {activeScheme && (
        <Dialog open={!!activeScheme} onOpenChange={(open) => !open && setActiveScheme(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {activeScheme.name}
                </DialogTitle>
                {activeScheme.status === 'eligible' && (
                  <Badge className="bg-green-500">
                    <BadgeCheck className="h-3 w-3 mr-1" /> Eligible
                  </Badge>
                )}
                {activeScheme.status === 'ineligible' && (
                  <Badge variant="outline" className="text-red-500 border-red-500">
                    Not Eligible
                  </Badge>
                )}
              </div>
              <DialogDescription>{activeScheme.description}</DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden">
              {!eligibilityMode && !applyMode ? (
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Coverage Amount</h4>
                      <p className="text-sm">{activeScheme.coverageAmount}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Benefits</h4>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {activeScheme.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Eligibility Criteria</h4>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {activeScheme.eligibilityCriteria.map((criteria, index) => (
                          <li key={index}>{criteria}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Required Documents</h4>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {activeScheme.documents.map((document, index) => (
                          <li key={index}>{document}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Official Website</h4>
                      <a 
                        href={activeScheme.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center"
                      >
                        Visit official website <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </ScrollArea>
              ) : eligibilityMode ? (
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Check Your Eligibility</h3>
                    <p className="text-sm text-muted-foreground">
                      Answer the following questions to check if you are eligible for {activeScheme.name}.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    {eligibilityChecklists[activeScheme.id]?.questions.map((question, index) => (
                      <div key={question.id} className="space-y-3">
                        <Label className="font-medium">
                          {index + 1}. {question.question}
                        </Label>
                        <RadioGroup value={answers[question.id] || ''} onValueChange={(value) => handleAnswerChange(question.id, value)}>
                          {question.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                              <Label htmlFor={`${question.id}-${option}`} className="font-normal">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Apply for {activeScheme.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      We're processing your application. Please wait while we submit your details.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Progress value={applicationProgress} className="h-2" />
                    <p className="text-sm text-center">
                      {applicationProgress < 100 
                        ? `Processing application: ${applicationProgress}%` 
                        : 'Application submitted successfully!'}
                    </p>
                    
                    <div className="border rounded-md p-4 bg-amber-50 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Important Note</p>
                        <p className="text-sm text-amber-700">
                          The online application is the first step. You may need to visit your local healthcare center with original documents to complete the process.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              {!eligibilityMode && !applyMode ? (
                <>
                  {activeScheme.status === 'check-eligibility' && (
                    <Button onClick={handleStartEligibilityCheck}>
                      Check Eligibility
                    </Button>
                  )}
                  {activeScheme.status === 'eligible' && (
                    <Button onClick={handleStartApplication}>
                      Apply Now
                    </Button>
                  )}
                </>
              ) : eligibilityMode ? (
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setEligibilityMode(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitEligibility}>
                    Submit
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setApplyMode(false)} disabled={applicationProgress < 100}>
                  {applicationProgress < 100 ? 'Please wait...' : 'Close'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GovernmentSchemes;
