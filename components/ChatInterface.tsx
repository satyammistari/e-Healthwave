
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Image, Mic, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import MedicalMessageTemplates from './MedicalMessageTemplates';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'doctor';
  timestamp: Date;
  attachments?: {
    type: 'image' | 'document' | 'audio' | 'video';
    url: string;
    name: string;
  }[];
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  buttonText?: string;
  // Recipient properties
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  recipientRole?: string;
  isTyping?: boolean;
}

interface MessageProps {
  message: Message;
  isUser: boolean;
  recipientAvatar?: string;
}

const Message: React.FC<MessageProps> = ({ message, isUser, recipientAvatar }) => {
  return (
    <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={recipientAvatar || "https://github.com/shadcn.png"} alt="Avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1.5 rounded-md px-3 py-2 w-fit max-w-[400px]" style={{ backgroundColor: isUser ? '#DCF8C6' : '#FFFFFF' }}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="border rounded overflow-hidden">
                {attachment.type === 'image' && (
                  <img src={attachment.url} alt={attachment.name} className="max-w-full h-auto" />
                )}
                {attachment.type === 'document' && (
                  <div className="flex items-center p-2 bg-gray-50">
                    <Paperclip className="w-4 h-4 mr-2" />
                    <span className="text-xs">{attachment.name}</span>
                  </div>
                )}
                {attachment.type === 'audio' && (
                  <audio controls className="w-full">
                    <source src={attachment.url} />
                  </audio>
                )}
                {attachment.type === 'video' && (
                  <video controls className="max-w-full h-auto">
                    <source src={attachment.url} />
                  </video>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-end gap-1">
          <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</span>
          {isUser && message.status && (
            <span className="text-xs text-gray-500">
              {message.status === 'sending' && '•'}
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && <span className="text-blue-500">✓✓</span>}
            </span>
          )}
        </div>
      </div>
      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages = [],
  onSendMessage,
  placeholder = "Type your message...",
  buttonText = "Send",
  recipientAvatar,
  recipientName,
  recipientRole,
  isTyping = false
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if ((newMessage.trim() || attachments.length > 0) && onSendMessage) {
      onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleTemplateSelect = (template: string) => {
    setNewMessage(prev => prev + (prev ? '\n\n' : '') + template);
    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Adjust height to fit content
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {recipientName && (
        <div className="p-3 border-b flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={recipientAvatar || "https://github.com/shadcn.png"} alt="Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">{recipientName}</h3>
            {recipientRole && <p className="text-xs text-gray-500">{recipientRole}</p>}
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isUser={message.sender === 'user'}
              recipientAvatar={recipientAvatar}
            />
          ))}
          {isTyping && (
            <div className="flex items-start gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={recipientAvatar || "https://github.com/shadcn.png"} alt="Avatar" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 px-3 py-2 rounded-md" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Card className="border-t rounded-t-none">
        <CardContent className="p-4">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center p-1 px-2 bg-gray-100 rounded text-xs gap-2">
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button 
                    onClick={() => removeAttachment(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Textarea
              placeholder={placeholder}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="min-h-[80px] flex-1"
              onKeyDown={handleKeyDown}
              ref={textareaRef}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline"
                  className="rounded-full"
                  onClick={handleFileSelect}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline"
                  className="rounded-full"
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline"
                  className="rounded-full"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="outline"
                  className="rounded-full"
                >
                  <Film className="h-4 w-4" />
                </Button>
                <MedicalMessageTemplates onSelectTemplate={handleTemplateSelect} />
              </div>
              <Button 
                type="submit" 
                size="icon" 
                variant="default"
                className="rounded-full"
                disabled={!newMessage.trim() && attachments.length === 0}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
