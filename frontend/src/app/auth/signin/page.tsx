"use client";

import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Globe } from "lucide-react";
import { useState } from "react";

export default function SignInPage() {
  const [signInError, setSignInError] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="border-b border-gray-100 py-4 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <Link href="/" className="flex items-center">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-blue-600/70 to-blue-700/70 shadow-inner">
              <Globe className="absolute h-5 w-5 animate-pulse text-white" />
              <div className="absolute h-5 w-5 rounded-full bg-blue-400 opacity-20"></div>
            </div>
            <div className="ml-2.5">
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Savannah</h1>
              <div className="-mt-1 text-xs font-medium text-blue-600">INTELLIGENCE</div>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-600">
              Sign in to your Savannah Intelligence account
            </p>
          </div>

          {signInError && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
              <p>{signInError}</p>
            </div>
          )}

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                  footerActionLink: "text-blue-600 hover:text-blue-700",
                },
              }}
              routing="path"
              path="/auth/signin"
              signUpUrl="/auth/signup"
              afterSignInUrl="/dashboard"
              signInUrl="/auth/signin"
              afterSignUpUrl="/auth/onboarding"
            />
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            New to Savannah Intelligence?{" "}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-700">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-600 sm:flex-row sm:space-y-0">
            <p>&copy; 2025 Savannah Intel. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-blue-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-blue-600">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}