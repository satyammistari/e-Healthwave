
import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  link,
  delay = 0 
}) => {
  const CardContent = () => (
    <>
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">
        {description}
      </p>
    </>
  );

  if (link) {
    return (
      <Link to={link} className="block">
        <div 
          className="bg-white rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all group animate-scale-up"
          style={{ animationDelay: `${delay}s` }}
        >
          <CardContent />
        </div>
      </Link>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all group animate-scale-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <CardContent />
    </div>
  );
};

export default FeatureCard;
