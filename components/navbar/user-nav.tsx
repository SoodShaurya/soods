"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/components/ui/use-toast";
import { useUser } from "reactfire";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function UserNav() {
  const { data } = useUser();
  const router = useRouter();
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const { toast } = useToast();

  const doLogout = async () => {
    await signOut(getAuth());
    toast({ title: "Logged out", description: "You have been logged out." });
    router.replace("/");
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowLogoutButton(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowLogoutButton(false);
    }, 300);
  };

  const navigateToDashboard = () => {
    router.push("/app");
  };

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
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      <div
        className={`absolute rounded-full bg-gray-400/10 dark:bg-white/10 outline outline-black/10 dark:outline-white/10 backdrop-blur-sm transition-all duration-500 ease-in-out ${
          showLogoutButton ? "right-0 w-full h-full mr-2 pl-4 outline-black/20 dark:outline-white/20 opacity-100" : "right-0 w-10 h-10 mr-2 pl-4 opacity-100"
        }`}
      />
      <div className="flex items-center relative z-10">
        {showLogoutButton && (
          <div className="transition-opacity duration-300 opacity-100 flex items-center">
            <Button variant="ghost" onClick={doLogout} className="mr-1 rounded-full">
              Logout
            </Button>
            <Button variant="ghost" onClick={navigateToDashboard} className="mr-1 rounded-full">
              Dashboard
            </Button>
            <Button variant="ghost" onClick={toggleDarkMode} className="mr-1 rounded-full flex items-center">
              {isDarkMode ? <IconMoon size={20} /> : <IconSun size={20} />}
            </Button>
          </div>
        )}
        <div
          className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300 ${
            showLogoutButton ? "ml-4" : ""
          }`}
        >
          <Avatar className="h-8 w-8 mr-4">
            <AvatarImage src={data?.photoURL || "/avatars/09.png"} alt={data?.displayName || "@soods"} />
            <AvatarFallback>
              {(data?.displayName?.slice(0, 2) || data?.email?.slice(0, 2) || "").toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}