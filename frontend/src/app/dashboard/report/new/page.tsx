'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Save, Send, AlertTriangle,
  Plus, Trash2, FileText
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';

interface ReportFormData {
  title: string;
  type: string;
  region: string;
  country: string;
  summary: string;
  topics: string[];
  content?: string;
  confidence?: string;
}

export default function NewReportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [reportData, setReportData] = useState<ReportFormData>({
    title: '',
    type: 'comprehensive',
    region: '',
    country: '',
    summary: '',
    topics: [],
    confidence: 'Medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: Record<string, string> = {};
    if (!reportData.title.trim()) errors.title = 'Report title is required';
    if (!reportData.region.trim()) errors.region = 'Region is required';
    if (!reportData.summary.trim()) errors.summary = 'Executive summary is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be an API call to save the report
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard/reports');
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReportData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAddTopic = (topic: string) => {
    if (topic && !reportData.topics.includes(topic)) {
      setReportData(prev => ({
        ...prev,
        topics: [...prev.topics, topic]
      }));
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setReportData(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t !== topic)
    }));
  };

  const handleSaveDraft = () => {
    // In a real app, this would save the draft to the database
    alert('Draft saved successfully');
  };

  return (
    <div className="p-6">
      <DashboardHeader
        title="Create New Report"
        description="Draft a new intelligence report"
        showInfoTip
        infoTipContent="Create comprehensive intelligence reports by filling out the form below. You can save drafts and publish when ready."
      >
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/dashboard/reports')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Cancel
          </button>
        </div>
      </DashboardHeader>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Report Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={reportData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter a descriptive title for the report"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={reportData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="comprehensive">Comprehensive Analysis</option>
                  <option value="economic">Economic Focus</option>
                  <option value="political">Political Focus</option>
                  <option value="security">Security Focus</option>
                  <option value="entity">Entity Profile</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="confidence" className="block text-sm font-medium text-gray-700 mb-1">
                  Confidence Level
                </label>
                <select
                  id="confidence"
                  name="confidence"
                  value={reportData.confidence}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                  Region*
                </label>
                <select
                  id="region"
                  name="region"
                  value={reportData.region}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.region ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a region</option>
                  <option value="West Africa">West Africa</option>
                  <option value="East Africa">East Africa</option>
                  <option value="North Africa">North Africa</option>
                  <option value="Southern Africa">Southern Africa</option>
                  <option value="Central Africa">Central Africa</option>
                </select>
                {formErrors.region && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.region}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={reportData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Specify country (if applicable)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                Executive Summary*
              </label>
              <textarea
                id="summary"
                name="summary"
                value={reportData.summary}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.summary ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Write a concise summary of the report"
              />
              {formErrors.summary && (
                <p className="mt-1 text-sm text-red-600">{formErrors.summary}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topics
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {reportData.topics.map(topic => (
                  <div
                    key={topic}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center"
                  >
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1.5 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  id="newTopic"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a topic (e.g., Economic Development)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTopic((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  onClick={() => {
                    const input = document.getElementById('newTopic') as HTMLInputElement;
                    handleAddTopic(input.value);
                    input.value = '';
                  }}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Press Enter or click the plus button to add a topic
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
              <FileText className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">Draft Mode</h5>
                <p className="text-sm text-blue-800">
                  This form creates the basic report structure. After saving, you'll be able to add detailed sections, charts, and risk assessments.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => router.push('/dashboard/reports')}
            >
              Cancel
            </button>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Save className="h-4 w-4 mr-1.5" />
                Save Draft
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
              >
                {isSubmitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1.5" />
                    Create Report
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
