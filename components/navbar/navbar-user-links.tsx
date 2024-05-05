"use client";
import { UserNav } from "@/components/navbar/user-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC, useState, useEffect } from "react";
import { useUser } from "reactfire";
import { IconArrowLeft, IconSun, IconMoon } from "@tabler/icons-react";
import { useToast } from "@/components/ui/use-toast";

export const NavbarUserLinks: FC = () => {
  const { data, hasEmitted } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check the user's system preference for dark mode
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevState) => {
      const newIsDarkMode = !prevState;
      document.documentElement.classList.toggle("dark", newIsDarkMode);
      toast({
        title: `Theme changed to ${newIsDarkMode ? "Dark" : "Light"} mode`,
      });
      return newIsDarkMode;
    });
  };

  useEffect(() => {
    // Set the initial theme based on user preference or system setting
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDarkMode);
    if (prefersDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <>
      {hasEmitted && data ? (
        <>
          <UserNav />
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="outline" className="rounded-full">
              Login / Register &rarr;
            </Button>
          </Link>
          <Button onClick={toggleDarkMode} className="ml-4 rounded-full">
            {isDarkMode ? <IconSun size={24} /> : <IconMoon size={24} />}
          </Button>
        </>
      )}
    </>
  );
};