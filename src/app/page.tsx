// app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingOverlay from "@/components/common/LoadingOverlay";

export default function Home() {
  const { isAuthenticated, isProfileComplete, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth");
      } else if (!isProfileComplete) {
        router.push("/getting-started");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isProfileComplete, isLoading, router]);

  return <LoadingOverlay isVisible={true} message="Redirection..." />;
}
