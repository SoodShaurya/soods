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
          </div>
          <div className="container flex flex-col items-center gap-8 text-center w-min h-[74vh] justify-center">
            <h1 className="max-w-4xl font-heading font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter mb-4">
              projects
            </h1>
            <div className="w-[1200px] max-w-full align-middle mb-14">
              <ul
                ref={wrapperRef}
                className="group flex flex-col gap-3 md:h-[480px] md:flex-row md:gap-[1.5%] justify-center "
              >
                {projects.map((project, index) => (
                  <li
                    key={project.name}
                    onClick={() => setActiveItem(index)}
                    aria-current={activeItem === index}
                    className={classNames(
                      "relative cursor-pointer md:w-[8%] md:[&[aria-current='true']]:w-[48%]",
                      "md:[transition:width_var(--transition,200ms_ease-in)]",
                      "md:before-block before:absolute before:bottom-0 before:left-[-10px] before:right-[-10px] before:top-0 before:hidden before:bg-white",
                      "md:[&:not(:hover),&:not(:first),&:not(:last)]:group-hover:w-[7%] md:hover:w-[12%]",
                      "md:outline md:outline-2 md:outline-white/20 md:rounded-2xl"
                    )}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#c9c6c7]">
                      <img
                        className="absolute right-0 top-1/2 h-auto w-24 max-w-none -translate-y-1/2 object-cover md:left-1/2 md:h-[480px] md:w-[590px] md:-translate-x-1/2"
                        src={project.img}
                        alt={project.name}
                        width="590px"
                        height="480px"
                      />
                      <div
                        className={classNames(
                          "inset-0 opacity-25 duration-500 before:absolute before:bottom-0 before:left-[-546px] before:right-0 before:top-[-148px] before:z-10 before:bg-texture  after:bottom-[21px] after:left-0 after:right-[-434px] after:top-0 after:z-10 after:bg-texture md:absolute md:transition-opacity",
                          activeItem === index ? "md:opacity-25" : "md:opacity-0"
                        )}
                      />
                      <div
                        className={classNames(
                          "left-6 top-6 w-[590px] p-4 transition-[transform,opacity] md:absolute md:p-0 md:justify-start transition-ease-in-out duration-300",
                          activeItem === index
                            ? "md:translate-x-0 md:opacity-100"
                            : "md:translate-x-4 md:opacity-0"
                        )}
                      >
                        <p className="text-lg font-bold text-white md:text-4xl md:text-left">
                          {project.name}
                        </p>
                        <p className="text-sm text-primary text-white md:text-lg md:text-left">
                          {project.title}
                        </p>
                        
                      </div>
                      <div
                        className={classNames(
                          "absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-primary text-white font-bold transition-ease-in-out duration-300 backdrop-blur-lg drop-shadow-2xl",
                          activeItem === index
                            ? "md:bottom-4 md:left-10"
                            : "md:bottom-4 md:left-1/2 md:-translate-x-1/2"
                        )}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}