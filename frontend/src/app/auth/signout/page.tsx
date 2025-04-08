"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();
  const { signOut: clerkSignOut } = useClerk();
  
  useEffect(() => {
    async function handleSignOut() {
      try {
        // If using Clerk
        await clerkSignOut();
        
        // If using NextAuth
        await signOut({ redirect: false });
        
        // Redirect to home page after successful sign out
        router.push("/");
      } catch (error) {
        console.error("Error signing out:", error);
        // Still redirect to home in case of error
        router.push("/");
      }
    }
    
    handleSignOut();
  }, [clerkSignOut, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Signing Out</h1>
        <p>Please wait while we sign you out...</p>
      </div>
    </div>
  );
}