import React, { useState, useRef, useEffect } from 'react';
import { 
  Database, Upload, Globe, Play, UploadCloud, X,
  Info, AlertTriangle, ChevronLeft, ChevronRight,
  Check, Loader2, File, FileSpreadsheet, FileJson,
  FileText, Link, BrainCircuit, Plus, AlertCircle,
  ArrowRight
} from 'lucide-react';
import { dataSourceTemplates } from '@/data/mock/data';

export interface ImportConfig {
  sourceType: string;
  mapping: Record<string, string>;
  options: Record<string, any>;
  name: string;
  description: string;
  scheduleRefresh: boolean;
  refreshInterval: string;
  refreshUnit: 'hours' | 'days' | 'weeks';
  fieldMappings: FieldMapping[];
  templateId?: string; // Add this new field
  connectionDetails?: {
    fileName?: string;
    fileType?: string;
    fileSize?: number;
    host?: string;
    port?: string;
    database?: string;
    username?: string;
    apiEndpoint?: string;
    authMethod?: string;
  };
}

interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformations: string[];
}

type DataImportStep = 'source' | 'configure' | 'preview' | 'mapping' | 'validation' | 'complete';

interface PreviewDataRow {
  [key: string]: string | number | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (config: ImportConfig) => void;
  initialTemplate?: string | null;
}

export default function DataImportModal({ isOpen, onClose, onImportComplete, initialTemplate }: Props) {
  const [currentStep, setCurrentStep] = useState<DataImportStep>('source');
  const [selectedSourceType, setSelectedSourceType] = useState<'file' | 'database' | 'api' | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<PreviewDataRow[]>([]);
  const [detectedFields, setDetectedFields] = useState<string[]>([]);
  const [availableTargetFields, setAvailableTargetFields] = useState<string[]>([
    'location', 'date', 'value', 'category', 'source', 'confidence', 'entity', 'sentiment', 'description'
  ]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for the import configuration with all needed fields
  const [importConfig, setImportConfig] = useState<ImportConfig>({
    sourceType: '',
    mapping: {},
    options: {},
    name: '',
    description: '',
    scheduleRefresh: false,
    refreshInterval: '24',
    refreshUnit: 'hours',
    fieldMappings: []
  });

  // Add template handling logic
  useEffect(() => {
    if (initialTemplate) {
      // Find the template in dataSourceTemplates
      const template = dataSourceTemplates.find(t => t.id === initialTemplate);
      if (template) {
        setImportConfig(prev => ({
          ...prev,
          name: template.name,
          description: `Based on ${template.name} template`,
          templateId: template.id
        }));
        
        // If this is a file template, prompt file selection
        if (template.category === 'custom' || template.category === 'economy') {
          setSelectedSourceType('file');
        } else if (template.category === 'security') {
          // For security data, default to database connection
          setSelectedSourceType('database');
        } else {
          // For other templates, default to API
          setSelectedSourceType('api');
        }
      }
    }
  }, [initialTemplate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImportConfig(prev => ({
        ...prev,
        name: file.name.split('.')[0],
        sourceType: 'file',
        connectionDetails: { 
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        }
      }));
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
          // Simulate detected fields and preview data
          setDetectedFields(['id', 'date', 'region', 'country', 'value', 'category', 'notes']);
          setPreviewData([
            { id: 1, date: '2025-03-30', region: 'East Africa', country: 'Kenya', value: 125, category: 'Economic', notes: 'Quarterly report data' },
            { id: 2, date: '2025-03-30', region: 'East Africa', country: 'Tanzania', value: 87, category: 'Economic', notes: 'Estimated values' },
            { id: 3, date: '2025-03-30', region: 'West Africa', country: 'Nigeria', value: 213, category: 'Economic', notes: 'Official figures' },
          ]);
          // Generate initial field mappings
          const initialMappings: FieldMapping[] = detectedFields.map(field => ({
            sourceField: field,
            targetField: getMatchingTargetField(field),
            transformations: []
          }));
          setImportConfig(prev => ({
            ...prev,
            fieldMappings: initialMappings
          }));
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const getMatchingTargetField = (sourceField: string): string => {
    // Simple logic to map source fields to target fields based on name similarity
    const fieldMap: Record<string, string> = {
      'id': '',
      'date': 'date',
      'region': 'location',
      'country': 'location',
      'value': 'value',
      'category': 'category',
      'notes': 'description',
    };
    return fieldMap[sourceField.toLowerCase()] || '';
  };

  const validateMapping = () => {
    setIsProcessing(true);
    // Simulate validation process
    setTimeout(() => {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      const mappings = importConfig.fieldMappings || [];
      
      // Check for required fields
      if (!mappings.some(m => m.targetField === 'location')) {
        errors.push('Required field "location" is not mapped');
      }
      
      // Add sample warnings
      if (!mappings.some(m => m.targetField === 'date')) {
        warnings.push('Date field is recommended for time-based analysis');
      }
      
      const unmappedCount = mappings.filter(m => m.targetField === '').length;
      if (unmappedCount > 2) {
        warnings.push('Multiple fields are unmapped and will be ignored');
      }
      
      setValidationErrors(errors);
      setValidationWarnings(warnings);
      setIsProcessing(false);
    }, 1500);
  };

  const finalizeImport = () => {
    setIsProcessing(true);
    // Simulate import process
    setTimeout(() => {
      onImportComplete(importConfig);
      setIsProcessing(false);
      onClose();
      // Reset state for next time
      setCurrentStep('source');
      setSelectedSourceType(null);
      setSelectedFile(null);
      setUploadProgress(0);
      setPreviewData([]);
      setDetectedFields([]);
      setValidationErrors([]);
      setValidationWarnings([]);
    }, 2000);
  };

  const nextStep = () => {
    switch (currentStep) {
      case 'source':
        if (selectedSourceType === 'file' && selectedFile) {
          simulateFileUpload();
          setCurrentStep('configure');
        } else if (selectedSourceType) {
          setCurrentStep('configure');
        }
        break;
      case 'configure':
        setCurrentStep('preview');
        break;
      case 'preview':
        setCurrentStep('mapping');
        break;
      case 'mapping':
        validateMapping();
        setCurrentStep('validation');
        break;
      case 'validation':
        setCurrentStep('complete');
        break;
      case 'complete':
        finalizeImport();
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case 'configure':
        setCurrentStep('source');
        break;
      case 'preview':
        setCurrentStep('configure');
        break;
      case 'mapping':
        setCurrentStep('preview');
        break;
      case 'validation':
        setCurrentStep('mapping');
        break;
      case 'complete':
        setCurrentStep('validation');
        break;
    }
  };

  const updateFieldMapping = (index: number, field: 'sourceField' | 'targetField', value: string) => {
    const updatedMappings = [...importConfig.fieldMappings];
    updatedMappings[index] = { ...updatedMappings[index], [field]: value };
    setImportConfig(prev => ({
      ...prev,
      fieldMappings: updatedMappings
    }));
  };

  const addTransformation = (index: number, transformation: string) => {
    const updatedMappings = [...importConfig.fieldMappings];
    updatedMappings[index] = { 
      ...updatedMappings[index],
      transformations: [...updatedMappings[index].transformations, transformation]
    };
    setImportConfig(prev => ({
      ...prev,
      fieldMappings: updatedMappings
    }));
  };

  const removeTransformation = (mappingIndex: number, transformationIndex: number) => {
    const updatedMappings = [...importConfig.fieldMappings];
    const updatedTransformations = [...updatedMappings[mappingIndex].transformations];
    updatedTransformations.splice(transformationIndex, 1);
    
    updatedMappings[mappingIndex] = { 
      ...updatedMappings[mappingIndex],
      transformations: updatedTransformations
    };
    
    setImportConfig(prev => ({
      ...prev,
      fieldMappings: updatedMappings
    }));
  };

  const getFileIcon = (fileName: string) => {
    if (!fileName) return <File className="h-10 w-10 text-gray-400" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
      case 'json':
      case 'geojson':
        return <FileJson className="h-10 w-10 text-yellow-500" />;
      case 'txt':
        return <FileText className="h-10 w-10 text-blue-500" />;
      default:
        return <File className="h-10 w-10 text-gray-400" />;
    }
  };

  // Progress bar with step indicators
  const stepLabels: Record<DataImportStep, string> = {
    'source': 'Source',
    'configure': 'Configure',
    'preview': 'Preview',
    'mapping': 'Mapping',
    'validation': 'Validation',
    'complete': 'Complete'
  };

  const allSteps: DataImportStep[] = ['source', 'configure', 'preview', 'mapping', 'validation', 'complete'];
  const currentStepIndex = allSteps.indexOf(currentStep);
  const progressPercentage = (currentStepIndex / (allSteps.length - 1)) * 100;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-bold text-gray-800">Import Data</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className="mb-2 flex justify-between items-center">
            {allSteps.map((step, index) => (
              <div 
                key={step} 
                className={`flex flex-col items-center ${index <= currentStepIndex ? 'text-teal-600' : 'text-gray-400'}`}
                style={{ width: `${100 / allSteps.length}%` }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  index < currentStepIndex ? 'bg-teal-500 text-white' :
                  index === currentStepIndex ? 'border-2 border-teal-500 text-teal-600' :
                  'border-2 border-gray-300 text-gray-400'
                }`}>
                  {index < currentStepIndex ? <Check className="h-3 w-3" /> : index + 1}
                </div>
                <span className="text-xs mt-1 font-medium">{stepLabels[step]}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full mt-1 mb-6">
            <div 
              className="h-1 bg-teal-500 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {currentStep === 'source' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Select Data Source</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setSelectedSourceType('file')}
                    className={`p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center text-center transition-colors ${
                      selectedSourceType === 'file' ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'border-gray-200'
                    }`}
                  >
                    <UploadCloud className={`h-12 w-12 mb-3 ${selectedSourceType === 'file' ? 'text-teal-500' : 'text-gray-400'}`} />
                    <h4 className="font-medium mb-1">Upload File</h4>
                    <p className="text-sm text-gray-500">CSV, Excel, JSON, GeoJSON</p>
                  </button>
                  
                  <button 
                    onClick={() => setSelectedSourceType('database')}
                    className={`p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center text-center transition-colors ${
                      selectedSourceType === 'database' ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'border-gray-200'
                    }`}
                  >
                    <Database className={`h-12 w-12 mb-3 ${selectedSourceType === 'database' ? 'text-teal-500' : 'text-gray-400'}`} />
                    <h4 className="font-medium mb-1">Connect Database</h4>
                    <p className="text-sm text-gray-500">PostgreSQL, MySQL, MongoDB</p>
                  </button>
                  
                  <button 
                    onClick={() => setSelectedSourceType('api')}
                    className={`p-4 border rounded-lg hover:bg-gray-50 flex flex-col items-center text-center transition-colors ${
                      selectedSourceType === 'api' ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'border-gray-200'
                    }`}
                  >
                    <Link className={`h-12 w-12 mb-3 ${selectedSourceType === 'api' ? 'text-teal-500' : 'text-gray-400'}`} />
                    <h4 className="font-medium mb-1">API Connection</h4>
                    <p className="text-sm text-gray-500">REST, GraphQL, WebHooks</p>
                  </button>
                </div>
              </div>
              
              {selectedSourceType === 'file' && (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Upload File</h3>
                  
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-teal-500 transition-colors cursor-pointer bg-gray-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {!selectedFile ? (
                      <>
                        <UploadCloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="font-medium text-gray-600 mb-1">Drag and drop your file here</p>
                        <p className="text-sm text-gray-500 mb-4">Or click to browse files</p>
                        <p className="text-xs text-gray-400">Supports CSV, XLSX, JSON, GeoJSON (max 50MB)</p>
                      </>
                    ) : (
                      <div className="flex items-center justify-center space-x-4">
                        {getFileIcon(selectedFile.name)}
                        <div className="text-left">
                          <p className="font-medium text-gray-800">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                    )}
                    
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".csv,.xlsx,.xls,.json,.geojson,.txt"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>
              )}
              
              {selectedSourceType === 'database' && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Database Connection Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Database Type</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500">
                        <option>PostgreSQL</option>
                        <option>MySQL</option>
                        <option>MongoDB</option>
                        <option>Oracle</option>
                        <option>SQL Server</option>
                        <option>SQLite</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="localhost or IP address" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Port</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="e.g. 5432" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                      <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Enter database name" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Username" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Password" />
                      </div>
                    </div>
                    
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200">
                      Test Connection
                    </button>
                  </div>
                </div>
              )}
              
              {selectedSourceType === 'api' && (
                <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-md font-medium text-gray-800 mb-3">API Connection Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Type</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500">
                        <option>REST API</option>
                        <option>GraphQL</option>
                        <option>WebHook</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                      <input type="text" className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="https://api.example.com/data" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Method</label>
                      <select className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500">
                        <option>No Authentication</option>
                        <option>API Key</option>
                        <option>Bearer Token</option>
                        <option>Basic Auth</option>
                        <option>OAuth 2.0</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headers (Optional)</label>
                      <textarea className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Content-Type: application/json&#10;Accept: application/json" rows={3} />
                    </div>
                    
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200">
                      Test API Connection
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {currentStep === 'configure' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Configure Import</h3>
                
                {selectedSourceType === 'file' && selectedFile && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start mb-4">
                    {getFileIcon(selectedFile.name)}
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
                              className="bg-teal-500 h-1.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs flex items-center text-green-600">
                          <Check className="h-3 w-3 mr-1" /> Processed successfully
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Source Name*</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Enter a name for this data source"
                      value={importConfig.name}
                      onChange={(e) => setImportConfig(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Optional description about this data and its purpose"
                      rows={3}
                      value={importConfig.description}
                      onChange={(e) => setImportConfig(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="schedule-refresh" 
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      checked={importConfig.scheduleRefresh}
                      onChange={(e) => setImportConfig(prev => ({ ...prev, scheduleRefresh: e.target.checked }))}
                    />
                    <label htmlFor="schedule-refresh" className="text-sm text-gray-700">Schedule automatic refresh</label>
                  </div>
                  
                  {importConfig.scheduleRefresh && (
                    <div className="pl-6 space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Refresh every</span>
                        <input 
                          type="number" 
                          min="1" 
                          className="w-20 p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                          value={importConfig.refreshInterval || '24'}
                          onChange={(e) => setImportConfig(prev => ({ ...prev, refreshInterval: e.target.value }))}
                        />
                        <select 
                          className="p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                          value={importConfig.refreshUnit || 'hours'}
                          onChange={(e) => setImportConfig(prev => ({ ...prev, refreshUnit: e.target.value as 'hours' | 'days' | 'weeks' }))}
                        >
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Add tags separated by commas (e.g., economic, kenya, quarterly)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 'preview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Data Preview</h3>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {previewData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(previewData[0]).map((header) => (
                              <th 
                                key={header}
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {previewData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.values(row).map((cell, cellIndex) => (
                                <td 
                                  key={cellIndex}
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                >
                                  {cell?.toString() || ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Loader2 className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-spin" />
                      <p>Loading preview data...</p>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-2">Showing first 3 rows of data. The full dataset will be processed on import.</p>
              </div>
            </div>
          )}
          
          {currentStep === 'mapping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Field Mapping</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Map the fields from your data source to our system fields. This ensures your data is correctly integrated.
                </p>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source Field</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Field</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transformations</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {importConfig.fieldMappings.map((mapping, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {mapping.sourceField}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              className="w-full p-1.5 border border-gray-300 rounded-md text-sm focus:ring-teal-500 focus:border-teal-500"
                              value={mapping.targetField}
                              onChange={(e) => updateFieldMapping(index, 'targetField', e.target.value)}
                            >
                              <option value="">-- Ignore this field --</option>
                              {availableTargetFields.map(field => (
                                <option key={field} value={field}>{field}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col space-y-2">
                              {mapping.transformations.map((transform, transIndex) => (
                                <div key={transIndex} className="flex items-center">
                                  <span className="text-xs bg-gray-100 py-1 px-2 rounded text-gray-700 flex-1">{transform}</span>
                                  <button 
                                    className="ml-2 text-red-500 hover:text-red-700"
                                    onClick={() => removeTransformation(index, transIndex)}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center"
                                onClick={() => addTransformation(index, 'Convert to uppercase')}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Transformation
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                  <h4 className="font-medium flex items-center mb-1">
                    <Info className="h-4 w-4 mr-1.5 text-blue-600" />
                    Mapping Tips
                  </h4>
                  <ul className="list-disc list-inside pl-1 space-y-1 text-blue-700">
                    <li>The "location" field is required - map a region, country, or city field here</li>
                    <li>Date fields should be mapped to "date" to enable time-based analysis</li>
                    <li>If your data contains both country and city, map the most specific one to "location"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 'validation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Validation Results</h3>
                
                {isProcessing ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-10 w-10 mx-auto mb-4 text-teal-500 animate-spin" />
                    <p className="text-gray-600">Validating your data...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {validationErrors.length > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-1.5 text-red-600" />
                          Errors That Must Be Fixed
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-red-700 text-sm">
                          {validationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                        <button 
                          onClick={prevStep}
                          className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
                        >
                          <ArrowRight className="h-4 w-4 mr-1 transform rotate-180" />
                          Go back to fix
                        </button>
                      </div>
                    )}
                    
                    {validationWarnings.length > 0 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-1.5 text-yellow-600" />
                          Warnings (You can proceed, but we recommend fixing)
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
                          {validationWarnings.map((warning, index) => (
                            <li key={index}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {validationErrors.length === 0 && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2 flex items-center">
                          <Check className="h-5 w-5 mr-1.5 text-green-600" />
                          Data Validation Successful
                        </h4>
                        <p className="text-sm text-green-700">
                          {validationWarnings.length === 0 
                            ? 'Your data is ready to be imported without any issues.'
                            : 'Your data can be imported, but consider addressing the warnings above for best results.'}
                        </p>
                      </div>
                    )}
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Data Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Source Type:</p>
                          <p className="font-medium">{selectedSourceType === 'file' ? 'File Upload' : selectedSourceType === 'database' ? 'Database Connection' : 'API Connection'}</p>
                        </div>
                        {selectedFile && (
                          <div>
                            <p className="text-gray-600 mb-1">File Name:</p>
                            <p className="font-medium">{selectedFile.name}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600 mb-1">Fields Mapped:</p>
                          <p className="font-medium">{importConfig.fieldMappings.filter(m => m.targetField).length} of {importConfig.fieldMappings.length}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Refresh Schedule:</p>
                          <p className="font-medium">
                            {importConfig.scheduleRefresh 
                              ? `Every ${importConfig.refreshInterval} ${importConfig.refreshUnit}`
                              : 'No automatic refresh'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {currentStep === 'complete' && (
            <div className="space-y-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Import</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Your data is ready to be imported into the system. Click "Complete Import" to finish the process.
                </p>
                
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-left mb-6 max-w-lg mx-auto">
                  <h4 className="font-medium text-blue-800 mb-2">What happens next?</h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                    <li>Your data will be processed and integrated into the Savannah Intelligence platform</li>
                    <li>The data will be available for analysis, reports, and visualizations</li>
                    <li>You can manage this data source from the Data Management screen</li>
                    {importConfig.scheduleRefresh && (
                      <li>Automatic refresh will occur every {importConfig.refreshInterval} {importConfig.refreshUnit}</li>
                    )}
                  </ul>
                </div>
                
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2 text-teal-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Processing import...</span>
                  </div>
                ) : (
                  <button
                    onClick={finalizeImport}
                    className="bg-teal-600 text-white py-2 px-6 rounded-md text-sm font-medium hover:bg-teal-700 flex items-center mx-auto"
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    Complete Import
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-between bg-gray-50">
          <button
            onClick={prevStep}
            disabled={currentStep === 'source' || isProcessing}
            className={`py-2 px-4 rounded-md text-sm font-medium flex items-center
              ${currentStep === 'source' || isProcessing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            Back
          </button>
          
          <button
            onClick={nextStep}
            disabled={
              (currentStep === 'source' && !selectedSourceType) ||
              (currentStep === 'source' && selectedSourceType === 'file' && !selectedFile) ||
              (currentStep === 'validation' && validationErrors.length > 0) ||
              isProcessing
            }
            className={`py-2 px-4 rounded-md text-sm font-medium flex items-center
              ${(currentStep === 'source' && !selectedSourceType) ||
                (currentStep === 'source' && selectedSourceType === 'file' && !selectedFile) ||
                (currentStep === 'validation' && validationErrors.length > 0) ||
                isProcessing
                ? 'bg-teal-300 text-white cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                Processing...
              </>
            ) : currentStep === 'complete' ? (
              <>
                <Check className="h-4 w-4 mr-1.5" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}