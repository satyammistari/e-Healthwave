
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  FileText, 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  Brain, 
  Heart, 
  Clipboard, 
  ScanLine, 
  Leaf, 
  Bone, 
  Microscope,
  BookOpen
} from "lucide-react";

interface MedicalMessageTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

const MedicalMessageTemplates: React.FC<MedicalMessageTemplatesProps> = ({ onSelectTemplate }) => {
  const [open, setOpen] = useState(false);
  
  const templates = [
    {
      category: "Diagnosis",
      icon: <Stethoscope className="h-4 w-4 mr-2" />,
      items: [
        {
          id: "diagnosis-1",
          name: "Examination Results",
          content: "Based on our examination, I've found the following: \n\n- Vital signs: \n- Physical examination: \n- Concerning symptoms: \n\nMy initial assessment is: "
        },
        {
          id: "diagnosis-2",
          name: "Differential Diagnosis",
          content: "I'm considering the following diagnoses based on your symptoms:\n\n1. \n2. \n3. \n\nTo rule out or confirm these possibilities, I recommend the following tests:"
        },
        {
          id: "diagnosis-3",
          name: "Diagnostic Plan",
          content: "To determine the cause of your symptoms, I recommend the following diagnostic plan:\n\n1. \n2. \n3. \n\nThese will help us identify the underlying condition and develop an appropriate treatment plan."
        }
      ]
    },
    {
      category: "Treatment",
      icon: <Pill className="h-4 w-4 mr-2" />,
      items: [
        {
          id: "treatment-1",
          name: "Medication Instructions",
          content: "I'm prescribing the following medication:\n\n- Medication: \n- Dosage: \n- Frequency: \n- Duration: \n- Take with/without food: \n\nPossible side effects include: \n\nPlease contact me if you experience severe side effects."
        },
        {
          id: "treatment-2",
          name: "Treatment Plan",
          content: "Here's your treatment plan:\n\n1. Medications: \n2. Lifestyle modifications: \n3. Follow-up appointments: \n\nOur goal is to: "
        },
        {
          id: "treatment-3",
          name: "Surgery Preparation",
          content: "To prepare for your upcoming surgery:\n\n1. Pre-surgery instructions: \n2. Fasting requirements: \n3. Medications to avoid: \n4. What to bring: \n\nThe surgery is scheduled for: "
        },
        {
          id: "treatment-4",
          name: "Ayurveda Recommendations",
          content: "Based on Ayurvedic principles, I recommend the following:\n\n1. Dietary changes: \n2. Herbs and supplements: \n3. Daily practices: \n4. Lifestyle modifications: \n\nThese recommendations aim to balance your doshas and promote natural healing."
        }
      ]
    },
    {
      category: "Lab Results",
      icon: <FlaskConical className="h-4 w-4 mr-2" />,
      items: [
        {
          id: "lab-1",
          name: "Normal Lab Results",
          content: "I've reviewed your lab results, and everything appears to be within normal range. Here's a summary:\n\n- Complete Blood Count: Normal\n- Metabolic Panel: Normal\n- Lipid Profile: Normal\n\nThis suggests: "
        },
        {
          id: "lab-2",
          name: "Abnormal Lab Results",
          content: "I've reviewed your lab results, and there are some values that require attention:\n\n- Abnormal findings: \n- Possible implications: \n- Recommended next steps: \n\nLet's schedule a follow-up to discuss these findings in detail."
        },
        {
          id: "lab-3",
          name: "Radiology Results",
          content: "I've reviewed your imaging results:\n\n- Type of scan: \n- Findings: \n- Impression: \n\nBased on these results, I recommend: "
        }
      ]
    },
    {
      category: "Cardiac",
      icon: <Heart className="h-4 w-4 mr-2" />,
      items: [
        {
          id: "cardiac-1",
          name: "ECG Interpretation",
          content: "ECG Interpretation:\n\n- Rate: \n- Rhythm: \n- Axis: \n- Intervals: \n- ST/T changes: \n\nImpression: "
        },
        {
          id: "cardiac-2",
          name: "Cardiac Symptoms Inquiry",
          content: "Regarding your cardiac symptoms:\n\n1. How would you describe the chest pain/discomfort? (sharp, dull, pressure, etc.)\n2. Does it radiate to other areas like your arm, jaw, or back?\n3. Is it associated with exertion?\n4. How long does it typically last?\n5. Do you experience shortness of breath, dizziness, or palpitations with it?"
        },
        {
          id: "cardiac-3",
          name: "Cardiovascular Risk Assessment",
          content: "Based on your risk factors and clinical findings, your cardiovascular risk assessment is as follows:\n\n- Major risk factors: \n- 10-year cardiovascular risk score: \n- Risk category: \n\nRecommendations to reduce risk: "
        }
      ]
    },
    {
      category: "Neurology",
      icon: <Brain className="h-4 w-4 mr-2" />,
      items: [
        {
          id: "neuro-1",
          name: "Neurological Examination",
          content: "Neurological Examination Findings:\n\n- Mental Status: \n- Cranial Nerves: \n- Motor Function: \n- Sensory Function: \n- Reflexes: \n- Coordination: \n- Gait: \n\nImpression: "
        },
        {
          id: "neuro-2",
          name: "Headache Assessment",
          content: "Headache Assessment:\n\n1. Location: \n2. Quality: \n3. Intensity (1-10): \n4. Duration: \n5. Associated symptoms: \n6. Triggers: \n7. Relieving factors: \n\nImpression: "
        },
        {
          id: "neuro-3",
          name: "Cognitive Assessment",
          content: "Cognitive Assessment Results:\n\n- Orientation: \n- Attention: \n- Memory: \n- Language: \n- Executive function: \n- Visuospatial ability: \n\nImpression and recommendations: "
        }
      ]
    },
    {
      category: "Mental Health",
      icon: <Clipboard className="h-4 w-4 mr-2" />,
      items: [
        {
          id: "mental-1",
          name: "Depression Screening",
          content: "Depression Screening Results:\n\n- PHQ-9 Score: \n- Key symptoms noted: \n- Risk assessment: \n\nRecommendations: "
        },
        {
          id: "mental-2",
          name: "Anxiety Assessment",
          content: "Anxiety Assessment:\n\n- GAD-7 Score: \n- Key symptoms noted: \n- Functional impact: \n\nRecommended approach: "
        },
        {
          id: "mental-3",
          name: "Stress Management",
          content: "Stress Management Recommendations:\n\n1. Mindfulness practices: \n2. Physical activity: \n3. Sleep hygiene: \n4. Cognitive techniques: \n5. Social support: \n\nAdditional resources: "
        },
        {
          id: "mental-4",
          name: "Therapy Referral",
          content: "I'm referring you to therapy for further support with your mental health:\n\n- Type of therapy recommended: \n- Frequency: \n- Expected duration: \n- Goals: \n\nIn the meantime, please continue with: "
        }
      ]
    },
    {
      category: "Imaging",
      icon: <ScanLine className="h-4 w-4 mr-2" />,
      items: [
        {
          id: "imaging-1",
          name: "X-Ray Report",
          content: "X-Ray Report:\n\n- Area examined: \n- Findings: \n- Impression: \n\nRecommendations based on these findings: "
        },
        {
          id: "imaging-2",
          name: "MRI Report",
          content: "MRI Report:\n\n- Area examined: \n- Technique: \n- Findings: \n- Impression: \n\nRecommendations based on these findings: "
        },
        {
          id: "imaging-3",
          name: "CT Scan Report",
          content: "CT Scan Report:\n\n- Area examined: \n- Technique: \n- Findings: \n- Impression: \n\nRecommendations based on these findings: "
        },
        {
          id: "imaging-4",
          name: "Ultrasound Report",
          content: "Ultrasound Report:\n\n- Area examined: \n- Findings: \n- Impression: \n\nRecommendations based on these findings: "
        }
      ]
    },
    {
      category: "Specialty Consultations",
      icon: <Microscope className="h-4 w-4 mr-2" />,
      items: [
        {
          id: "specialty-1",
          name: "Specialist Referral",
          content: "I'm referring you to a specialist for further evaluation and management:\n\n- Specialty: \n- Reason for referral: \n- Specific questions to address: \n- Relevant history and findings: \n\nPlease bring the following to your appointment: "
        },
        {
          id: "specialty-2",
          name: "Multidisciplinary Discussion",
          content: "After discussing your case with our multidisciplinary team, we recommend:\n\n- Key findings discussed: \n- Team consensus: \n- Recommended approach: \n- Next steps: \n\nWe believe this comprehensive approach will provide the best care for your condition."
        },
        {
          id: "specialty-3",
          name: "Second Opinion Request",
          content: "Based on the complexity of your condition, I recommend obtaining a second opinion:\n\n- Areas of uncertainty: \n- Specific questions to address: \n- Recommended specialist type: \n\nThis additional perspective will help ensure you receive optimal care."
        }
      ]
    },
    {
      category: "Research & Education",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      items: [
        {
          id: "research-1",
          name: "Literature Review",
          content: "Recent literature on this topic suggests:\n\n1. Key findings: \n2. Clinical implications: \n3. Limitations of current evidence: \n\nHow this applies to your case: "
        },
        {
          id: "research-2",
          name: "Clinical Trial Information",
          content: "There is a clinical trial that might be relevant to your condition:\n\n- Trial name/ID: \n- Purpose: \n- Eligibility criteria: \n- Potential benefits/risks: \n- Location and contact: \n\nWould you like more information about participating?"
        },
        {
          id: "research-3",
          name: "Case Presentation",
          content: "Case Presentation Summary:\n\n- Patient demographics: \n- Presenting complaint: \n- Relevant history: \n- Physical examination: \n- Investigations: \n- Diagnosis: \n- Management: \n- Outcome: \n- Discussion points: \n\nLearning points from this case: "
        }
      ]
    }
  ];
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          <span>Templates</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[400px]" align="start" side="top" sideOffset={5} alignOffset={-5}>
        <Command>
          <CommandInput placeholder="Search medical templates..." />
          <CommandList className="max-h-[300px] overflow-auto">
            <CommandEmpty>No templates found.</CommandEmpty>
            {templates.map((category) => (
              <CommandGroup key={category.category} heading={category.category}>
                {category.items.map((template) => (
                  <CommandItem
                    key={template.id}
                    onSelect={() => {
                      onSelectTemplate(template.content);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2"
                  >
                    {category.icon}
                    <span>{template.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MedicalMessageTemplates;
