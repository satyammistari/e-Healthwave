
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, AlertCircle, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ConsistencyCheckAlertProps {
  title: string;
  description: string;
  details: any[];
  onDismiss: () => void;
  onProceed?: () => void;
  variant?: 'default' | 'destructive' | 'warning';
}

const ConsistencyCheckAlert: React.FC<ConsistencyCheckAlertProps> = ({
  title,
  description,
  details,
  onDismiss,
  onProceed,
  variant = 'warning'
}) => {
  const getAlertIcon = () => {
    switch (variant) {
      case 'destructive':
        return <X className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Alert 
      variant={variant === 'warning' ? 'default' : variant}
      className={`
        border-l-4 
        ${variant === 'destructive' ? 'border-l-destructive' : 
          variant === 'warning' ? 'border-l-orange-500' : 'border-l-primary'}
      `}
    >
      <div className="flex items-start">
        <div className={`
          mr-2 p-1 rounded-full 
          ${variant === 'destructive' ? 'bg-destructive text-destructive-foreground' : 
            variant === 'warning' ? 'bg-orange-500 text-white' : 'bg-primary text-primary-foreground'}
        `}>
          {getAlertIcon()}
        </div>
        <div className="flex-1">
          <AlertTitle className="mb-2 text-base font-medium">{title}</AlertTitle>
          <AlertDescription>
            <p className="mb-3">{description}</p>
            
            {details.length > 0 && (
              <ScrollArea className="h-40 w-full rounded border p-2 bg-background mb-3">
                <div className="space-y-2">
                  {details.map((detail, index) => (
                    <div key={index} className="p-2 border rounded-md">
                      {detail.medication && (
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{detail.medication}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {detail.dosage}
                            </span>
                          </div>
                          <Badge variant="outline" className={
                            detail.status === 'duplicate' ? 'bg-orange-500/10 text-orange-500' : 
                            detail.status === 'conflict' ? 'bg-destructive/10 text-destructive' : 
                            'bg-primary/10 text-primary'
                          }>
                            {detail.status}
                          </Badge>
                        </div>
                      )}
                      
                      {detail.date && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(detail.date), 'PPP')}
                        </div>
                      )}
                      
                      {detail.message && (
                        <div className="text-sm mt-1">{detail.message}</div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={onDismiss}>
                Dismiss
              </Button>
              {onProceed && (
                <Button variant="default" size="sm" onClick={onProceed}>
                  <PlusCircle className="mr-1 h-3 w-3" />
                  Add Anyway
                </Button>
              )}
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default ConsistencyCheckAlert;
