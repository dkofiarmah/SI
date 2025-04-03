'use client';

import { useState } from 'react';
import { X, Settings, Save } from 'lucide-react';

export type DashboardWidget = {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
};

interface DashboardSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: DashboardWidget[];
  onSave: (widgets: DashboardWidget[]) => void;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export default function DashboardSettings({
  isOpen,
  onClose,
  widgets,
  onSave,
  timeframe,
  onTimeframeChange
}: DashboardSettingsProps) {
  const [localWidgets, setLocalWidgets] = useState<DashboardWidget[]>(widgets);
  const [localTimeframe, setLocalTimeframe] = useState(timeframe);

  if (!isOpen) return null;

  const handleWidgetToggle = (widgetId: string) => {
    setLocalWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget
      )
    );
  };

  const handleSave = () => {
    onSave(localWidgets);
    onTimeframeChange(localTimeframe);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <Settings className="h-5 w-5 mr-2 text-gray-600" />
            Dashboard Settings
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Data Timeframe</h4>
            <div className="flex items-center space-x-2">
              <select 
                value={localTimeframe}
                onChange={(e) => setLocalTimeframe(e.target.value)}
                className="bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 6 months</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select the time range for all dashboard data and charts
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Dashboard Widgets</h4>
            <p className="text-xs text-gray-500 mb-3">
              Select which widgets to display on your dashboard
            </p>
            
            <div className="space-y-3">
              {localWidgets.map(widget => (
                <div 
                  key={widget.id}
                  className="flex items-start p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <input 
                    type="checkbox" 
                    id={`widget-${widget.id}`}
                    checked={widget.enabled}
                    onChange={() => handleWidgetToggle(widget.id)}
                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <label 
                      htmlFor={`widget-${widget.id}`} 
                      className="font-medium text-gray-700 text-sm cursor-pointer"
                    >
                      {widget.name}
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">{widget.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}