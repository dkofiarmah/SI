"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud, Database, Link, FileSpreadsheet, Plus, 
  FileText, Filter, Search, ArrowRight, Calendar, 
  ChevronDown, CheckCircle2, Info, AlertTriangle, RefreshCw,
  Loader2
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { dataConnectorTypes, dataSourceTemplates, dataImportCategories } from '@/data/mock/data';
import { useLoading } from '@/providers/LoadingProvider';

export default function DataImportPage() {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const [currentStep, setCurrentStep] = useState<'source' | 'configure' | 'preview' | 'mapping' | 'validation' | 'complete'>('source');
  const [selectedSourceType, setSelectedSourceType] = useState<'file' | 'database' | 'api' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredTemplates = dataSourceTemplates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      simulateFileUpload();
    }
  };

  const simulateFileUpload = () => {
    setIsProcessing(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setCurrentStep('configure');
          return prev;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleTemplateSelect = (templateId: string) => {
    startLoading();
    
    setSelectedTemplate(templateId);
    
    const template = dataSourceTemplates.find(t => t.id === templateId);
    if (template) {
      setTimeout(() => {
        if (template.category === 'economy' || template.category === 'custom') {
          setSelectedSourceType('file');
          if (fileInputRef.current) {
            fileInputRef.current.click();
          }
        } else if (template.category === 'security') {
          setSelectedSourceType('database');
          setCurrentStep('configure');
        } else {
          setSelectedSourceType('api');
          setCurrentStep('configure');
        }
        
        stopLoading();
      }, 800);
    } else {
      stopLoading();
    }
  };

  const handleSourceTypeSelect = (type: 'file' | 'database' | 'api') => {
    setSelectedSourceType(type);
    if (type === 'file') {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      setCurrentStep('configure');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading data import options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader
        title="Data Import"
        description="Import your own data to enrich intelligence analysis"
        showInfoTip
        infoTipContent="Connect your data sources to combine with our intelligence platform for deeper insights. Supported formats include CSV, JSON, databases, and APIs."
        bgColor="white"
        sticky
      >
        <div className="flex space-x-2">
          <button
            onClick={() => router.push('/dashboard/data-management')}
            className="flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 text-sm hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Manage Data Sources
          </button>
        </div>
      </DashboardHeader>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          onChange={handleFileSelect}
          accept=".csv,.xlsx,.json,.geojson"
        />

        {currentStep === 'source' ? (
          <>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6 relative overflow-hidden mb-8">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Import Your Data</h2>
                <p className="text-gray-600 mb-4">
                  Upload your own data to enrich your intelligence analysis. Connect to files, databases, or APIs to bring your data into the platform.
                </p>
              </div>
              <div className="absolute right-6 top-6 hidden md:block opacity-70">
                <div className="grid grid-cols-2 gap-2">
                  <div className="w-16 h-8 bg-blue-100 rounded"></div>
                  <div className="w-16 h-8 bg-blue-200 rounded"></div>
                  <div className="w-16 h-8 bg-blue-300 rounded"></div>
                  <div className="w-16 h-8 bg-blue-200 rounded"></div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Connection Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {dataConnectorTypes.slice(0, 3).map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleSourceTypeSelect(
                    connector.id === 'csv' ? 'file' : 
                    connector.id === 'database' ? 'database' : 'api'
                  )}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center group"
                >
                  {connector.id === "csv" && <FileSpreadsheet className="h-12 w-12 text-blue-500 mb-3 group-hover:text-blue-600" />}
                  {connector.id === "database" && <Database className="h-12 w-12 text-blue-500 mb-3 group-hover:text-blue-600" />}
                  {connector.id === "api" && <Link className="h-12 w-12 text-blue-500 mb-3 group-hover:text-blue-600" />}
                  <h4 className="font-medium text-gray-800 mb-1">{connector.name}</h4>
                  <p className="text-sm text-gray-500">{connector.description}</p>
                  <div className="mt-4 text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                    Setup: {connector.setupComplexity}
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Data Templates</h3>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search templates..."
                      className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                  <div className="relative">
                    <select
                      value={selectedCategory || ''}
                      onChange={(e) => setSelectedCategory(e.target.value === '' ? null : e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      {dataImportCategories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
                  <Info className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-800">
                    Templates help you quickly map your data to our platform. Choose a template or create a custom mapping.
                  </p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <div key={template.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800 flex items-center">
                              {template.name}
                              {template.recommended && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                  Recommended
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            {template.fields.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Fields:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {template.fields.map((field, index) => (
                                    <span key={index} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                                      {field}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleTemplateSelect(template.id)}
                            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            Use Template
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No templates match your search criteria
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              <h3 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">Best Practices</h3>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-blue-100 bg-blue-50">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-blue-600" />
                    Data Format Tips
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside pl-1">
                    <li>Ensure dates are in ISO format (YYYY-MM-DD)</li>
                    <li>Include location data when available (country, city)</li>
                    <li>Clearly name your columns/fields</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-yellow-100 bg-yellow-50">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                    Common Issues
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside pl-1">
                    <li>Missing values in critical fields</li>
                    <li>Inconsistent location naming</li>
                    <li>Date format mismatches</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-green-100 bg-green-50">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 text-green-600" />
                    Auto-Refresh Options
                  </h4>
                  <ul className="text-sm text-green-700 space-y-2 list-disc list-inside pl-1">
                    <li>Set up automated refresh schedules</li>
                    <li>Configure data validation alerts</li>
                    <li>Use webhooks for real-time updates</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6">
            {selectedFile && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start mb-4">
                <FileSpreadsheet className="h-10 w-10 text-blue-500" />
                <div className="ml-4 flex-1">
                  <h4 className="font-medium text-gray-800">{selectedFile.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  
                  {uploadProgress < 100 ? (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs flex items-center text-green-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Processed successfully
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <h3 className="text-lg font-semibold mb-4">Configure Import</h3>
            
            <p className="text-gray-600 mb-6">
              {selectedSourceType === 'file' ? 
                'Your file is being processed. Configure how you want to import this data.' :
                selectedSourceType === 'database' ? 
                'Configure your database connection settings below.' :
                'Set up your API connection parameters below.'
              }
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Source Name*</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a name for this data source"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional description about this data and its purpose"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setCurrentStep('source')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                Back
              </button>
              
              <button
                onClick={() => router.push('/dashboard/data-management')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                Continue Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
