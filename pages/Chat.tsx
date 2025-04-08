
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';

// Demo data for doctors and patients
const chatContacts = {
  doctors: [
    {
      id: 'doctor_1',
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiologist',
      avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=0A84FF&color=fff',
      role: 'doctor',
    },
    {
      id: 'doctor_2',
      name: 'Dr. Rajesh Patel',
      specialty: 'Neurologist',
      avatar: 'https://ui-avatars.com/api/?name=Rajesh+Patel&background=30D158&color=fff',
      role: 'doctor',
    },
    {
      id: 'doctor_3',
      name: 'Dr. Ananya Singh',
      specialty: 'Pediatrician',
      avatar: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=FF9F0A&color=fff',
      role: 'doctor',
    },
  ],
  patients: [
    {
      id: 'patient_1',
      name: 'Rahul Mehta',
      age: 45,
      avatar: 'https://ui-avatars.com/api/?name=Rahul+Mehta&background=FF453A&color=fff',
      role: 'patient',
    },
    {
      id: 'patient_2',
      name: 'Sunita Gupta',
      age: 38,
      avatar: 'https://ui-avatars.com/api/?name=Sunita+Gupta&background=FFD60A&color=fff',
      role: 'patient',
    },
    {
      id: 'patient_3',
      name: 'Vikram Singh',
      age: 62,
      avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=30D158&color=fff',
      role: 'patient',
    },
    {
      id: 'patient_4',
      name: 'Preeti Sharma',
      age: 29,
      avatar: 'https://ui-avatars.com/api/?name=Preeti+Sharma&background=64D2FF&color=fff',
      role: 'patient',
    },
  ],
};

const Chat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipient, setRecipient] = useState<any>(null);
  
  useEffect(() => {
    // If user is a doctor, look for patient with the given ID
    // If user is a patient, look for doctor with the given ID
    if (id === 'new') {
      // If it's a new chat, default to the first available contact
      if (user?.role === 'doctor') {
        setRecipient(chatContacts.patients[0]);
      } else {
        setRecipient(chatContacts.doctors[0]);
      }
      return;
    }
    
    const lookupList = user?.role === 'doctor' ? chatContacts.patients : chatContacts.doctors;
    const foundRecipient = lookupList.find(contact => contact.id === id);
    
    if (foundRecipient) {
      setRecipient(foundRecipient);
    } else {
      // If recipient not found, redirect to dashboard
      navigate(user?.role === 'doctor' ? '/doctor' : '/patient');
    }
  }, [id, user, navigate]);
  
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  if (!recipient) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading chat...</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-16rem)]">
            <div className="lg:col-span-1 hidden lg:block">
              <h2 className="text-lg font-semibold mb-4">Conversations</h2>
              <div className="space-y-2">
                {(user.role === 'doctor' ? chatContacts.patients : chatContacts.doctors).map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                      contact.id === recipient.id ? 'bg-primary/10' : 'hover:bg-secondary'
                    }`}
                    onClick={() => navigate(`/chat/${contact.id}`)}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={contact.avatar} 
                        alt={contact.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {contact.role === 'doctor' ? `Dr. - ${contact.specialty}` : 'Patient'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-3 h-full">
              <ChatInterface 
                recipientId={recipient.id}
                recipientName={recipient.name}
                recipientAvatar={recipient.avatar}
                recipientRole={recipient.role}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chat;
