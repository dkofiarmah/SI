"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Globe, ArrowRight, Building2, User, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { UserType } from "@/types";

type OnboardingStep = 1 | 2 | 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [userType, setUserType] = useState<UserType | undefined>(undefined);
  const [interests, setInterests] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  
  // Store actions to save onboarding data
  const { setUserType: storeSetUserType, 
          setUserInterests, 
          setUserFocusRegions, 
          completeOnboarding } = useStore();

  const interestOptions = [
    "Political Risk Analysis",
    "Security Threats",
    "Economic Trends",
    "Regulatory Changes",
    "Regional Stability",
    "Infrastructure Development",
    "Market Opportunities",
    "Crisis Alerts"
  ];

  const regionOptions = [
    "West Africa",
    "East Africa",
    "Central Africa",
    "Southern Africa",
    "North Africa",
    "Middle East",
    "Horn of Africa",
    "Sahel"
  ];

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type);
  };

  const handleInterestToggle = (interest: string) => {
    setInterests((prev) => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleRegionToggle = (region: string) => {
    setRegions((prev) => 
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleNextStep = () => {
    if (step === 1 && userType) {
      storeSetUserType(userType);
      setStep(2);
    } else if (step === 2 && interests.length > 0) {
      setUserInterests(interests);
      setStep(3);
    } else if (step === 3 && regions.length > 0) {
      // Save all preferences to store and complete onboarding
      setUserFocusRegions(regions);
      completeOnboarding();
      
      // Redirect to dashboard
      router.push("/dashboard");
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

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

      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="mb-10">
            <div className="mb-4 flex justify-center">
              <div className="flex items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <div className={`h-1 w-16 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <div className={`h-1 w-16 ${step > 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
              </div>
            </div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {step === 1 && "Welcome to Savannah Intelligence"}
              {step === 2 && "What are you interested in?"}
              {step === 3 && "Which regions do you focus on?"}
            </h2>
            <p className="mt-2 text-center text-gray-600">
              {step === 1 && `Hi ${user?.firstName || "there"}, help us customize your experience`}
              {step === 2 && "Select the topics that matter most to you"}
              {step === 3 && "Choose the regions you want to monitor"}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            {/* Step 1: User Type Selection */}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <button
                  onClick={() => handleUserTypeSelection("individual")}
                  className={`relative flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-all hover:shadow-md ${
                    userType === "individual" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  {userType === "individual" && (
                    <CheckCircle2 className="absolute right-4 top-4 h-6 w-6 text-blue-600" />
                  )}
                  <User className="mb-4 h-16 w-16 text-blue-600" />
                  <h3 className="mb-2 text-xl font-bold">Individual</h3>
                  <p className="text-sm text-gray-600">
                    For analysts, researchers, and professionals who need regional insights
                  </p>
                </button>

                <button
                  onClick={() => handleUserTypeSelection("institution")}
                  className={`relative flex flex-col items-center justify-center rounded-lg border p-6 text-center transition-all hover:shadow-md ${
                    userType === "institution" 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  {userType === "institution" && (
                    <CheckCircle2 className="absolute right-4 top-4 h-6 w-6 text-blue-600" />
                  )}
                  <Building2 className="mb-4 h-16 w-16 text-blue-600" />
                  <h3 className="mb-2 text-xl font-bold">Institution</h3>
                  <p className="text-sm text-gray-600">
                    For organizations, governments, and businesses operating in the region
                  </p>
                </button>
              </div>
            )}

            {/* Step 2: Interests Selection */}
            {step === 2 && (
              <div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`rounded-lg border p-3 text-center text-sm transition-all hover:shadow-sm ${
                        interests.includes(interest)
                          ? "border-blue-500 bg-blue-50 text-blue-800"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {userType === "institution" && (
                  <div className="mt-6">
                    <h4 className="mb-3 font-medium text-gray-700">Institution-specific topics:</h4>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      <button
                        onClick={() => handleInterestToggle("Compliance Monitoring")}
                        className={`rounded-lg border p-3 text-center text-sm transition-all hover:shadow-sm ${
                          interests.includes("Compliance Monitoring")
                            ? "border-blue-500 bg-blue-50 text-blue-800"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        Compliance Monitoring
                      </button>
                      <button
                        onClick={() => handleInterestToggle("Investment Risk")}
                        className={`rounded-lg border p-3 text-center text-sm transition-all hover:shadow-sm ${
                          interests.includes("Investment Risk")
                            ? "border-blue-500 bg-blue-50 text-blue-800"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        Investment Risk
                      </button>
                      <button
                        onClick={() => handleInterestToggle("Stakeholder Analysis")}
                        className={`rounded-lg border p-3 text-center text-sm transition-all hover:shadow-sm ${
                          interests.includes("Stakeholder Analysis")
                            ? "border-blue-500 bg-blue-50 text-blue-800"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        Stakeholder Analysis
                      </button>
                      <button
                        onClick={() => handleInterestToggle("Policy Influence")}
                        className={`rounded-lg border p-3 text-center text-sm transition-all hover:shadow-sm ${
                          interests.includes("Policy Influence")
                            ? "border-blue-500 bg-blue-50 text-blue-800"
                            : "border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        Policy Influence
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Regions Selection */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {regionOptions.map((region) => (
                  <button
                    key={region}
                    onClick={() => handleRegionToggle(region)}
                    className={`aspect-square rounded-lg border text-center transition-all hover:shadow-md ${
                      regions.includes(region)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <div className="flex h-full flex-col items-center justify-center p-3">
                      <span className="mb-2 text-sm font-medium">{region}</span>
                      {regions.includes(region) && (
                        <CheckCircle2 className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNextStep}
                disabled={
                  (step === 1 && !userType) ||
                  (step === 2 && interests.length === 0) ||
                  (step === 3 && regions.length === 0)
                }
                className={`flex items-center rounded-md px-6 py-3 font-medium text-white transition-colors ${
                  ((step === 1 && !userType) ||
                  (step === 2 && interests.length === 0) ||
                  (step === 3 && regions.length === 0))
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {step === 3 ? "Complete Setup" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-500">
            You can always change these preferences later in your dashboard settings
          </p>
        </div>
      </main>
    </div>
  );
}