
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  MessageSquare,
  FileText,
  Home,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/';
    return user.role === 'doctor' ? '/doctor' : '/patient';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary font-bold text-xl sm:text-2xl tracking-tight"
          >
            <span className="w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center">
              eH
            </span>
            <span className="hidden sm:inline">eHealthWave</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/chat/new" 
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  Chat
                </Link>
                <Link 
                  to="/records" 
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  Records
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback className="bg-primary text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-foreground/80 hover:text-destructive transition-colors"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                className="bg-primary hover:bg-primary/90 text-white" 
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </nav>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white/80 backdrop-blur-md z-40 animate-fade-in">
          <div className="flex flex-col gap-4 p-6">
            <Link 
              to="/" 
              className="flex items-center gap-2 py-3 px-4 hover:bg-secondary rounded-lg"
            >
              <Home size={20} />
              <span>Home</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="flex items-center gap-2 py-3 px-4 hover:bg-secondary rounded-lg"
                >
                  <User size={20} />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/chat/new" 
                  className="flex items-center gap-2 py-3 px-4 hover:bg-secondary rounded-lg"
                >
                  <MessageSquare size={20} />
                  <span>Chat</span>
                </Link>
                <Link 
                  to="/records" 
                  className="flex items-center gap-2 py-3 px-4 hover:bg-secondary rounded-lg"
                >
                  <FileText size={20} />
                  <span>Records</span>
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center gap-2 py-3 px-4 hover:bg-secondary rounded-lg"
                >
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
              </>
            )}
            
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive gap-2"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Logout</span>
              </Button>
            ) : (
              <Button 
                className="bg-primary hover:bg-primary/90 text-white" 
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
