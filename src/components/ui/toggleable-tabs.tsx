import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Search, X } from "lucide-react";

interface TabData {
  label: string;
  content: React.ReactNode;
}

interface ToggleableTabsProps {
  tabs: TabData[];
  defaultTab?: string;
}

const ToggleableTabs: React.FC<ToggleableTabsProps> = ({ tabs, defaultTab }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current && window.innerWidth < 768) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <Tabs defaultValue={defaultTab || tabs[0].label} className="w-full">
      <div className="flex items-center justify-between mb-4 w-full">
        <div className="flex-grow border-b border-pink-700 mr-4 md:mr-8 lg:mr-16 xl:mr-20 rounded-md">
          <TabsList className="flex w-[18rem] md:w-[24rem] lg:w-[32rem] border-gray-600">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.label} 
                value={tab.label}
                className="flex-1 py-2 px-4 text-pink-100 hover:text-white transition-all duration-300 ease-in-out relative group"
              >
                <span>
                  {tab.label}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 scale-x-0 transition-transform duration-300 ease-in-out group-data-[state=active]:scale-x-100"></span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex items-center ml-4 md:ml-8 lg:ml-20 xl:ml-24">
          <div className="hidden md:flex">
            <Input type="search" placeholder="Search Courses" className="md:w-64"/>
            <Button className="ml-2 bg-pink-600 hover:bg-pink-700">
              <Search className="h-4 w-4" /> 
            </Button>
          </div>
          <Button 
            className="md:hidden bg-pink-600 hover:bg-pink-700"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {isSearchOpen && (
        <div className="md:hidden mb-4">
          <div className="flex justify-between">
            <Input 
              ref={searchInputRef}
              type="search" 
              placeholder="Search Courses" 
              className="md:w-64"
            />
            <Button className="ml-2 bg-pink-600 hover:bg-pink-700">
              <Search className="h-4 w-4" /> 
            </Button>
          </div>
        </div>
      )}
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label} className="mt-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ToggleableTabs;