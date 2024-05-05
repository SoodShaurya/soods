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

export default function Home() {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Stars />
      <div className="grow flex flex-col items-center justify-center">
        <section className="space-y-6">
          <div className="container flex flex-col items-center gap-8 text-center w-full h-[84vh] justify-center">
            <h1 className="max-w-4xl font-heading font-semibold text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter align-bottom">
              soods
            </h1>
            <Button variant="outline" onClick={scrollToBottom} className="mr-1 rounded-full flex items-center">
              <IconArrowDown size={20} />
            </Button>
          </div>
          <div className="container flex flex-col items-center gap-8 text-center w-full h-[80vh] justify-center">
            <div className="grid grid-cols-3 grid-rows-2 gap-4 align-middle">
              <Card>
                <CardHeader>
                  <CardTitle>Card 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>This is the first card in the grid.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Card 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>This is the second card in the grid.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Card 3</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>This is the third card in the grid.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Card 4</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>This is the fourth card in the grid.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Card 5</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>This is the fifth card in the grid.</CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Card 6</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>This is the sixth card in the grid.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}