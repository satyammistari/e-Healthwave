
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, Calendar, Search, Edit, Trash2, PlusCircle, FileDown } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  condition: string;
  notes: string;
  status: 'active' | 'completed' | 'cancelled';
}

const mockMedications: Medication[] = [
  {
    id: '1',
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    startDate: '2023-09-15',
    endDate: '2023-12-15',
    condition: 'High cholesterol',
    notes: 'Take with evening meal',
    status: 'active'
  },
  {
    id: '2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    startDate: '2023-08-10',
    endDate: '2024-02-10',
    condition: 'Type 2 diabetes',
    notes: 'Take with meals to reduce GI side effects',
    status: 'active'
  },
  {
    id: '3',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    startDate: '2023-06-01',
    endDate: '2023-06-14',
    condition: 'Bacterial infection',
    notes: 'Course completed',
    status: 'completed'
  }
];

const MedicationManager = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>(mockMedications);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  
  // Form state
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id' | 'status'>>({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    condition: '',
    notes: ''
  });

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       med.condition.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && med.status === activeTab;
  });

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const medication: Medication = {
      ...newMedication,
      id: Date.now().toString(),
      status: 'active'
    };

    setMedications([medication, ...medications]);
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
      startDate: '',
      endDate: '',
      condition: '',
      notes: ''
    });
    setIsAddingMedication(false);

    toast({
      title: "Medication Added",
      description: `${medication.name} has been added to the patient's medication list`,
    });
  };

  const handleUpdateMedication = () => {
    if (!editingMedication) return;
    
    if (!editingMedication.name || !editingMedication.dosage || !editingMedication.frequency) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setMedications(medications.map(med => 
      med.id === editingMedication.id ? editingMedication : med
    ));

    setEditingMedication(null);

    toast({
      title: "Medication Updated",
      description: `${editingMedication.name} has been updated`,
    });
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    
    toast({
      title: "Medication Removed",
      description: "The medication has been removed from the patient's list",
    });
  };

  const handleChangeMedicationStatus = (id: string, status: 'active' | 'completed' | 'cancelled') => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, status } : med
    ));

    toast({
      title: "Status Updated",
      description: `Medication status changed to ${status}`,
    });
  };

  const handleExportMedications = () => {
    // In a real app, this would generate a PDF or CSV
    toast({
      title: "Medications Exported",
      description: "Medication list has been exported successfully",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Medication Management
        </CardTitle>
        <CardDescription>
          Track and manage patient medications and treatment plans
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search medications..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button onClick={() => setIsAddingMedication(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
            <Button variant="outline" onClick={handleExportMedications}>
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <MedicationTable 
              medications={filteredMedications} 
              onEdit={setEditingMedication}
              onDelete={handleDeleteMedication}
              onChangeStatus={handleChangeMedicationStatus}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="active" className="mt-4">
            <MedicationTable 
              medications={filteredMedications} 
              onEdit={setEditingMedication}
              onDelete={handleDeleteMedication}
              onChangeStatus={handleChangeMedicationStatus}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <MedicationTable 
              medications={filteredMedications} 
              onEdit={setEditingMedication}
              onDelete={handleDeleteMedication}
              onChangeStatus={handleChangeMedicationStatus}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
        </Tabs>

        {isAddingMedication && (
          <div className="border rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Medication</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAddingMedication(false)}
              >
                Cancel
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="med-name">Medication Name*</Label>
                <Input 
                  id="med-name" 
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder="Enter medication name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="med-dosage">Dosage*</Label>
                <Input 
                  id="med-dosage" 
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  placeholder="e.g., 10mg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="med-frequency">Frequency*</Label>
                <Input 
                  id="med-frequency" 
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                  placeholder="e.g., Twice daily"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="med-condition">Condition</Label>
                <Input 
                  id="med-condition" 
                  value={newMedication.condition}
                  onChange={(e) => setNewMedication({...newMedication, condition: e.target.value})}
                  placeholder="What condition is this treating?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="med-start-date">Start Date</Label>
                <Input 
                  id="med-start-date" 
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="med-end-date">End Date</Label>
                <Input 
                  id="med-end-date" 
                  type="date"
                  value={newMedication.endDate}
                  onChange={(e) => setNewMedication({...newMedication, endDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="med-notes">Notes</Label>
                <Textarea 
                  id="med-notes" 
                  value={newMedication.notes}
                  onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                  placeholder="Additional instructions or notes"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={handleAddMedication}>
                Add Medication
              </Button>
            </div>
          </div>
        )}

        {editingMedication && (
          <div className="border rounded-lg p-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Medication</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setEditingMedication(null)}
              >
                Cancel
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-med-name">Medication Name*</Label>
                <Input 
                  id="edit-med-name" 
                  value={editingMedication.name}
                  onChange={(e) => setEditingMedication({...editingMedication, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-med-dosage">Dosage*</Label>
                <Input 
                  id="edit-med-dosage" 
                  value={editingMedication.dosage}
                  onChange={(e) => setEditingMedication({...editingMedication, dosage: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-med-frequency">Frequency*</Label>
                <Input 
                  id="edit-med-frequency" 
                  value={editingMedication.frequency}
                  onChange={(e) => setEditingMedication({...editingMedication, frequency: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-med-condition">Condition</Label>
                <Input 
                  id="edit-med-condition" 
                  value={editingMedication.condition}
                  onChange={(e) => setEditingMedication({...editingMedication, condition: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-med-start-date">Start Date</Label>
                <Input 
                  id="edit-med-start-date" 
                  type="date"
                  value={editingMedication.startDate}
                  onChange={(e) => setEditingMedication({...editingMedication, startDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-med-end-date">End Date</Label>
                <Input 
                  id="edit-med-end-date" 
                  type="date"
                  value={editingMedication.endDate}
                  onChange={(e) => setEditingMedication({...editingMedication, endDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-med-status">Status</Label>
                <Select 
                  value={editingMedication.status} 
                  onValueChange={(value) => setEditingMedication({
                    ...editingMedication, 
                    status: value as 'active' | 'completed' | 'cancelled'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-med-notes">Notes</Label>
                <Textarea 
                  id="edit-med-notes" 
                  value={editingMedication.notes}
                  onChange={(e) => setEditingMedication({...editingMedication, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button onClick={handleUpdateMedication}>
                Update Medication
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MedicationTableProps {
  medications: Medication[];
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: 'active' | 'completed' | 'cancelled') => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

const MedicationTable: React.FC<MedicationTableProps> = ({ 
  medications, 
  onEdit, 
  onDelete, 
  onChangeStatus,
  getStatusBadge
}) => {
  if (medications.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/10">
        <p className="text-muted-foreground">No medications found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Medication</TableHead>
            <TableHead>Dosage & Frequency</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {medications.map((med) => (
            <TableRow key={med.id}>
              <TableCell className="font-medium">{med.name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{med.dosage}</span>
                  <span className="text-muted-foreground text-sm">{med.frequency}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{med.startDate || 'N/A'}</span>
                  <span> - </span>
                  <span>{med.endDate || 'Ongoing'}</span>
                </div>
              </TableCell>
              <TableCell>{med.condition}</TableCell>
              <TableCell>{getStatusBadge(med.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(med)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {med.status === 'active' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onChangeStatus(med.id, 'completed')}
                    >
                      <Clock className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(med.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MedicationManager;
