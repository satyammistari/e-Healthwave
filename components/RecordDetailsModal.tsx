import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/utils/dateUtils";

interface RecordDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: {
    id: string;
    type: string;
    timestamp: number;
    data: any;
    hospitalId?: string;
  };
}

export const RecordDetailsModal: React.FC<RecordDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const renderData = (data: any) => {
    if (typeof data === 'object') {
      return (
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 gap-4">
              <div className="font-medium">{key}:</div>
              <div>{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}</div>
            </div>
          ))}
        </div>
      );
    }
    return <div>{String(data)}</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{record.type}</DialogTitle>
          <DialogDescription>
            Record from {formatDate(record.timestamp)}
            {record.hospitalId && ` • Hospital ID: ${record.hospitalId}`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {renderData(record.data)}
          </div>
        </ScrollArea>
        <div className="flex justify-end mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 