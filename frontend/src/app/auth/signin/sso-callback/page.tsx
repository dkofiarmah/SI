"use client";

import { useEffect, Suspense } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

function SignInSSOCallbackContent() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Extract the 'redirect_url' from the URL query parameters
    const redirectUrl = searchParams.get("redirect_url") || "/dashboard";
    
    const completeSignIn = async () => {
      if (!isLoaded) return;
      
      try {
        // Complete the OAuth sign-in process using the correct method
        const result = await signIn.create({
          strategy: "oauth_google", // Use a valid provider like "oauth_google" instead of "oauth_callback"
          redirectUrl: window.location.href,
        });
        
        // Set the active session
        if (result.status === "complete") {
          await setActive({ session: result.createdSessionId });
          router.push(redirectUrl);
        }
      } catch (error) {
        console.error("Error during SSO callback:", error);
        // Redirect to sign in page on error
        router.push("/auth/signin");
      }
    };
    
    completeSignIn();
  }, [isLoaded, signIn, setActive, router, searchParams]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Completing your sign in</h3>
        <p className="text-gray-600">Please wait while we securely sign you in...</p>
      </div>
    </div>
  );
}

export default function SignInSSOCallback() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading</h3>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    }>
      <SignInSSOCallbackContent />
    </Suspense>
  );
}