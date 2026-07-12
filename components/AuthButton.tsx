"use client";

import React, { useState } from "react";
import { sour } from "../font/font";
import { LogIn, LogOut } from "lucide-react";
import { AuthModal } from "./AuthModal";
import ThemeToggle from "./themeBtn";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions";

const AuthButton = ({ user }: any) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (user) {
    return (
      <div className="flex justify-center items-center gap-2">
        <ThemeToggle />
        <Button
          onClick={() => signOut()}
          variant="outline"
          size={"lg"}
          className="cursor-pointer"
        >
          <span
            className={`${sour.className} flex items-center gap-1 dark:text-white`}
          >
            <LogOut />
            LogOut
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <ThemeToggle />
      <Button
        onClick={() => setShowAuthModal(true)}
        variant="outline"
        size={"lg"}
        className="cursor-pointer bg-sky-300"
      >
        <span
          className={`${sour.className} flex items-center gap-1 dark:text-white`}
        >
          Login
          <LogIn />
        </span>
      </Button>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default AuthButton;
