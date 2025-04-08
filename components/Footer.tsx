
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border/30 pt-16 pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Information */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
              <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
                eH
              </span>
              <span>eHealthWave</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Revolutionizing healthcare with blockchain security and AI-powered solutions for a healthier future.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/patient" className="text-muted-foreground hover:text-primary transition-colors">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link to="/doctor" className="text-muted-foreground hover:text-primary transition-colors">
                  Doctor Portal
                </Link>
              </li>
              <li>
                <Link to="/records" className="text-muted-foreground hover:text-primary transition-colors">
                  Health Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/telemedicine" className="text-muted-foreground hover:text-primary transition-colors">
                  Telemedicine
                </Link>
              </li>
              <li>
                <Link to="/ehr" className="text-muted-foreground hover:text-primary transition-colors">
                  Electronic Health Records
                </Link>
              </li>
              <li>
                <Link to="/ai-diagnosis" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Disease Prediction
                </Link>
              </li>
              <li>
                <Link to="/insurance" className="text-muted-foreground hover:text-primary transition-colors">
                  Insurance Integration
                </Link>
              </li>
              <li>
                <Link to="/mental-health" className="text-muted-foreground hover:text-primary transition-colors">
                  Mental Health Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  123 Health Avenue, Bangalore, Karnataka 560001, India
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-primary shrink-0" />
                <span className="text-muted-foreground">+91 12345 67890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-primary shrink-0" />
                <span className="text-muted-foreground">support@ehealthwave.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-border/30 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} eHealthWave. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
