'use client'
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { IconArrowDown } from "@tabler/icons-react";
import Stars from '@/components/fancy/stars';
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { projects } from "@/components/projects";
import EarthRenderer from '@/components/fancy/earth'; // Import the EarthRenderer component

export default function Home() {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };
  const [activeItem, setActiveItem] = useState(5);
  const wrapperRef = useRef<HTMLUListElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    wrapperRef.current.style.setProperty(
      "--transition",
      "600ms cubic-bezier(0.22, 0.61, 0.36, 1)"
    );

    timeoutRef.current = setTimeout(() => {
      wrapperRef.current?.style.removeProperty("--transition");
    }, 900);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeItem]);

  return (
    <>
      <Stars />
      <div className="grow flex flex-col items-center justify-center">
        <section className="space-y-6">
          <div className="container flex flex-col items-center gap-8 text-center w-full h-[86vh] justify-center">
            <h1 className="max-w-4xl font-heading font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter align-bottom">
              soods
            </h1>
            <Button variant="outline" onClick={scrollToBottom} className="mr-1 rounded-full flex items-center">
              <IconArrowDown size={20} />
            </Button>
            <EarthRenderer /> {/* Render the Earth component */}
          </div>
          <div className="container flex flex-col items-center gap-8 text-center w-min h-[74vh] justify-center">
            <h1 className="max-w-4xl font-heading font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-4">
              projects
            </h1>
            <div className="w-[1200px] max-w-full align-middle mb-14">
              {/* ... existing project list code ... */}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}