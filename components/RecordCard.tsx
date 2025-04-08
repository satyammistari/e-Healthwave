
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Calendar, User, Shield } from 'lucide-react';

interface RecordCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  doctor: string;
  hospital?: string;
  recordType: 'Prescription' | 'Lab Report' | 'Diagnosis' | 'Vaccination' | 'Surgery';
  verified: boolean;
}

const RecordCard: React.FC<RecordCardProps> = ({
  id,
  title,
  description,
  date,
  doctor,
  hospital,
  recordType,
  verified,
}) => {
  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'Prescription':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Lab Report':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Diagnosis':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'Vaccination':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'Surgery':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card className="w-full overflow-hidden border border-border/50 hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <Badge 
            variant="outline" 
            className={`${getRecordTypeColor(recordType)} font-medium`}
          >
            {recordType}
          </Badge>
          {verified && (
            <div className="flex items-center text-green-600 text-xs">
              <Shield size={14} className="mr-1" />
              Blockchain Verified
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="text-sm space-y-2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{date}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <User size={16} />
          <span>Dr. {doctor}</span>
        </div>
        
        {hospital && (
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <span>{hospital}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" className="text-xs">
          View Details
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs flex items-center gap-1"
        >
          <Download size={14} />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecordCard;
