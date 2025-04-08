"use client";

import { useEffect, Suspense } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

function SSOCallbackContent() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Extract the 'after_sign_in_url' or 'redirect_url' from the URL query parameters
    const redirectUrl = searchParams.get("after_sign_in_url") || searchParams.get("redirect_url") || "/auth/onboarding";
    
    const continueSignUp = async () => {
      if (!isLoaded) return;
      
      try {
        // For OAuth (social login) callbacks, use the OAuth strategy
        const result = await signUp.create({
          strategy: "oauth_google", // Changed from "oauth" to "oauth_google" to match valid provider
          redirectUrl: window.location.href,
        });
        
        if (result.status === "complete") {
          // Set this session as active
          await setActive({ session: result.createdSessionId });
          
          // Redirect to the onboarding or to the URL specified in the query
          router.push(redirectUrl);
        }
      } catch (error) {
        console.error("Error during SSO callback:", error);
        // Redirect to sign up page on error
        router.push("/auth/signup");
      }
    };
    
    continueSignUp();
  }, [isLoaded, signUp, setActive, router, searchParams]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Completing your sign-up</h2>
        <p className="text-gray-600">Please wait while we finish setting up your account...</p>
      </div>
    </div>
  );
}

export default function SSOCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    }>
      <SSOCallbackContent />
    </Suspense>
  );
}