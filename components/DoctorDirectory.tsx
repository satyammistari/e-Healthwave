
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, FileText, UserPlus } from "lucide-react";

interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  avatar?: string;
  isOnline: boolean;
  tags: string[];
}

// Mock data for doctor directory
const mockDoctors: DoctorProfile[] = [
  {
    id: 'dr-1',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    hospital: 'AIIMS Delhi',
    avatar: '/avatars/doctor-1.jpg',
    isOnline: true,
    tags: ['Heart Specialist', 'Cardiac Surgery', 'Research']
  },
  {
    id: 'dr-2',
    name: 'Dr. Priya Sharma',
    specialty: 'Neurologist',
    hospital: 'Apollo Hospital, Mumbai',
    avatar: '/avatars/doctor-2.jpg',
    isOnline: false,
    tags: ['Brain Disorders', 'Stroke', 'Headaches']
  },
  {
    id: 'dr-3',
    name: 'Dr. Anand Verma',
    specialty: 'Pediatrician',
    hospital: 'Rainbow Children Hospital, Bangalore',
    avatar: '/avatars/doctor-3.jpg',
    isOnline: true,
    tags: ['Child Specialist', 'Vaccination', 'Child Development']
  },
  {
    id: 'dr-4',
    name: 'Dr. Sanjana Patel',
    specialty: 'Dermatologist',
    hospital: 'Max Healthcare, Delhi',
    avatar: '/avatars/doctor-4.jpg',
    isOnline: true,
    tags: ['Skin Disorders', 'Cosmetic Dermatology', 'Skin Cancer']
  },
  {
    id: 'dr-5',
    name: 'Dr. Vikram Singh',
    specialty: 'Orthopedic Surgeon',
    hospital: 'Fortis Hospital, Chennai',
    avatar: '/avatars/doctor-5.jpg',
    isOnline: false,
    tags: ['Joint Replacement', 'Sports Injuries', 'Spine Surgery']
  }
];

interface DoctorDirectoryProps {
  onSelectDoctor: (doctor: DoctorProfile) => void;
}

const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({ onSelectDoctor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorProfile[]>(mockDoctors);
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query && !specialtyFilter) {
      setFilteredDoctors(mockDoctors);
      return;
    }
    
    const filtered = mockDoctors.filter(doctor => {
      const matchesQuery = !query || 
        doctor.name.toLowerCase().includes(query) || 
        doctor.specialty.toLowerCase().includes(query) ||
        doctor.hospital.toLowerCase().includes(query) ||
        doctor.tags.some(tag => tag.toLowerCase().includes(query));
        
      const matchesSpecialty = !specialtyFilter || doctor.specialty === specialtyFilter;
      
      return matchesQuery && matchesSpecialty;
    });
    
    setFilteredDoctors(filtered);
  };
  
  const handleSpecialtyFilter = (specialty: string) => {
    if (specialtyFilter === specialty) {
      setSpecialtyFilter(null);
      
      if (!searchQuery) {
        setFilteredDoctors(mockDoctors);
      } else {
        handleSearch({ target: { value: searchQuery } } as React.ChangeEvent<HTMLInputElement>);
      }
    } else {
      setSpecialtyFilter(specialty);
      
      const filtered = mockDoctors.filter(doctor => {
        const matchesQuery = !searchQuery || 
          doctor.name.toLowerCase().includes(searchQuery) || 
          doctor.specialty.toLowerCase().includes(searchQuery) ||
          doctor.hospital.toLowerCase().includes(searchQuery) ||
          doctor.tags.some(tag => tag.toLowerCase().includes(searchQuery));
          
        return matchesQuery && doctor.specialty === specialty;
      });
      
      setFilteredDoctors(filtered);
    }
  };
  
  // Get unique specialties for filter buttons
  const specialties = Array.from(new Set(mockDoctors.map(doctor => doctor.specialty)));
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search doctors by name, specialty, or hospital..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-9"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {specialties.map(specialty => (
          <Button
            key={specialty}
            variant={specialtyFilter === specialty ? "default" : "outline"}
            size="sm"
            onClick={() => handleSpecialtyFilter(specialty)}
          >
            {specialty}
          </Button>
        ))}
      </div>
      
      <div className="space-y-3">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map(doctor => (
            <Card key={doctor.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex space-x-4">
                    <Avatar className="h-12 w-12 relative">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      {doctor.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                      )}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{doctor.name}</h3>
                        {doctor.isOnline && <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">Online</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                      <p className="text-xs text-muted-foreground">{doctor.hospital}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doctor.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-full h-8 w-8 p-0"
                      onClick={() => onSelectDoctor(doctor)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No doctors found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDirectory;
