"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Bell } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { addProduct } from "@/app/actions";
import { toast } from "sonner";

export default function AddProductForm({ user }: any) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("url", url);

    const result = await addProduct(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Prouct tracked successfully");
      setUrl("");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto ">
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Product URL (Amazon, Flipkart, etc.)"
          className="h-12 text-base rounded-4xl px-4"
          required
          disabled={loading}
        />

        <Button
          type="submit"
          disabled={loading}
          className="min-w-35 h-12.5 flex items-center justify-center gap-2 px-5 py-2.5 rounded-3xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-80 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-sm shadow-blue-500/10"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Tracking...</span>
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              <span>Track Price</span>
            </>
          )}
        </Button>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </form>
  );
}
