import 'gridstack/dist/gridstack.min.css';
import React, { useEffect } from 'react';
import { GridStack } from 'gridstack';
import { FC } from "react";
import Calculator from '@/components/Dashboard/calculator';
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
 


export const Dashboard: FC = () => {
  useEffect(() => {
    const grid = GridStack.init();
    const drawerGrid = GridStack.init();
  }, []);

  return (
    <div>
      <div className="grid-stack" style={{ background: 'transparent', outline: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px' }}>
        <div className="grid-stack-item" gs-w="3" gs-h="3" gs-min-w="3" gs-min-h="3"> 
          <div 
            className="grid-stack-item-content" 
            style={{
              backgroundColor: 'transparent',
              borderRadius: '8px',
              display: 'flex', // Use Flexbox
              justifyContent: 'center', // Center horizontally
              alignItems: 'center', // Center vertically
            }}>
            <Calculator />
          </div>
        </div>
      </div>

      <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
  <div className="mx-auto w-full">
    <DrawerHeader>
      <DrawerTitle>Widgets</DrawerTitle>
      <DrawerDescription>Drag widgets into the dashboard.</DrawerDescription>
    </DrawerHeader>
    <div style={{ background: 'transparent', outline: '2px solid rgba(255, 255, 255, 0.2)', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Calculator />
    </div>
    <DrawerFooter>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </div>
</DrawerContent>
    </Drawer>
    </div>
  );
};