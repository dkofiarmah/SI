"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Building2, User, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { UserType } from "@/types";

export default function PreferencesPage() {
  const { user, isLoaded } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  
  // Access the store to get and update user preferences
  const { 
    userPreferences,
    setUserType,
    setUserInterests,
    setUserFocusRegions
  } = useStore();
  
  // Local state for form management
  const [userType, setLocalUserType] = useState<UserType | undefined>(undefined);
  const [interests, setLocalInterests] = useState<string[]>([]);
  const [regions, setLocalRegions] = useState<string[]>([]);

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

  const institutionInterestOptions = [
    "Compliance Monitoring",
    "Investment Risk",
    "Stakeholder Analysis",
    "Policy Influence"
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

  // Load user preferences from the store
  useEffect(() => {
    if (userPreferences) {
      setLocalUserType(userPreferences.userType);
      setLocalInterests(userPreferences.interests || []);
      setLocalRegions(userPreferences.focusRegions || []);
    }
  }, [userPreferences]);

  const handleUserTypeSelection = (type: UserType) => {
    setLocalUserType(type);
  };

  const handleInterestToggle = (interest: string) => {
    setLocalInterests((prev) => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleRegionToggle = (region: string) => {
    setLocalRegions((prev) => 
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleSavePreferences = () => {
    setIsSaving(true);
    
    // Save to the store
    if (userType) {
      setUserType(userType);
    }
    setUserInterests(interests);
    setUserFocusRegions(regions);
    
    // Show success message
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage("Preferences saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    }, 500);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Preferences</h1>
        <p className="text-sm text-gray-600">
          Customize how Savannah Intelligence works for you
        </p>
      </div>

      <div className="space-y-8">
        {/* User Type Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">User Type</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              onClick={() => handleUserTypeSelection("individual")}
              className={`relative flex items-center rounded-lg border p-4 transition-all hover:shadow-sm ${
                userType === "individual" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-blue-200"
              }`}
            >
              {userType === "individual" && (
                <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-blue-600" />
              )}
              <User className="mr-4 h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-base font-medium">Individual</h3>
                <p className="text-xs text-gray-600">
                  For analysts, researchers, and professionals
                </p>
              </div>
            </button>

            <button
              onClick={() => handleUserTypeSelection("institution")}
              className={`relative flex items-center rounded-lg border p-4 transition-all hover:shadow-sm ${
                userType === "institution" 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-blue-200"
              }`}
            >
              {userType === "institution" && (
                <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-blue-600" />
              )}
              <Building2 className="mr-4 h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-base font-medium">Institution</h3>
                <p className="text-xs text-gray-600">
                  For organizations and businesses
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Interests Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Interests</h2>
          
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`rounded-lg border px-3 py-2 text-center text-sm transition-all hover:shadow-sm ${
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
            <div>
              <h3 className="mb-2 text-sm font-medium text-gray-700">Institution-specific topics:</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {institutionInterestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`rounded-lg border px-3 py-2 text-center text-sm transition-all hover:shadow-sm ${
                      interests.includes(interest)
                        ? "border-blue-500 bg-blue-50 text-blue-800"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Regions Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Regions</h2>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {regionOptions.map((region) => (
              <button
                key={region}
                onClick={() => handleRegionToggle(region)}
                className={`flex h-20 flex-col items-center justify-center rounded-lg border text-center transition-all hover:shadow-sm ${
                  regions.includes(region)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-200"
                }`}
              >
                <span className="text-sm font-medium">{region}</span>
                {regions.includes(region) && (
                  <CheckCircle2 className="mt-1 h-5 w-5 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-end space-x-4">
          {saveMessage && (
            <span className="text-sm font-medium text-green-600">{saveMessage}</span>
          )}
          <button
            onClick={handleSavePreferences}
            disabled={isSaving || !userType || interests.length === 0 || regions.length === 0}
            className={`rounded-md px-6 py-2 font-medium text-white transition-colors ${
              isSaving || !userType || interests.length === 0 || regions.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}