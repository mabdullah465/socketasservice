import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, LayoutDashboard, FolderPlus, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from '@/ContextProvider/AuthContext';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Nav items to avoid repetition
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  ];

  if (!isLoggedIn) return null; // Only show navbar if logged in

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">SocketasService</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="h-6 w-[1px] bg-border mx-2" />
          <span className="text-sm text-muted-foreground">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>

        {/* Mobile Navigation (Sidebar Trigger) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px]">
              <SheetHeader className="text-left mb-8">
                <SheetTitle>ProjManager</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-md hover:bg-accent"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <div className="px-2 py-2 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full justify-start">
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}