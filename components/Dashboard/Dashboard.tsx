import 'gridstack/dist/gridstack.min.css';
import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { GridStack } from 'gridstack';
import { FC } from "react";
import Calculator from '@/components/widgets/calculator';
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel"
import ChatComponent from '@/components/widgets/llmchat';

export const Dashboard: FC = () => {
  const [grid, setGrid] = useState<GridStack | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    setGrid(GridStack.init());
  }, []);

  const handleAddWidget = (index: number) => {
    console.log("Attempting to add widget at index:", index);
    const el = document.createElement('div');
    el.className = 'grid-stack-item';
    const contentEl = document.createElement('div');
    contentEl.className = 'grid-stack-item-content';
    el.appendChild(contentEl);
    // Render the calculator widget only if the current carousel index matches the specified index
    if (carouselIndex === index) {
      ReactDOM.render(<Calculator />, contentEl);
    } else {
      // Render a placeholder or other content if the index doesn't match
      ReactDOM.render(<div>Placeholder</div>, contentEl);
    }
    grid?.addWidget(el, { w: 3, h: 3 });
    console.log("Widget added");
  };

  return (
    <div>
      <div className="grid-stack" style={{ background: 'transparent', borderRadius: '16px' }}>
      </div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Widgets</DrawerTitle>
              <DrawerDescription>Insert new widgets.</DrawerDescription>
            </DrawerHeader>
            <div className="flex items-center justify-center">
              <Carousel className="w-full max-w-xs">
                <CarouselContent>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} onClick={() => setCarouselIndex(index)}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                            {index === 2 ? <Calculator /> : <span className="text-4xl font-semibold">{index + 1}</span>}
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <DrawerFooter>
              <Button onClick={() => handleAddWidget(2)}>Add Widget</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <ChatComponent apiKey="YOUR_API_KEY_HERE" />
    </div>
  );
};