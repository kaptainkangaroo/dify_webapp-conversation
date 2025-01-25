'use client';

import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import type { ICPRecord, IdeaRecord } from '@/types/grist';

export default function GristTwoTablesWidget() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedICP, setSelectedICP] = useState<ICPRecord | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<IdeaRecord | null>(null);
  const [notes, setNotes] = useState('');
  const [icpList, setIcpList] = useState<ICPRecord[]>([]);
  const [ideaList, setIdeaList] = useState<IdeaRecord[]>([]);
  const [apiResponse, setApiResponse] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Debug logging function
  const debugLog = useCallback((message: string) => {
    setDebugInfo(prev => prev + message + '\n');
  }, []);

  const clearDebugLog = useCallback(() => {
    setDebugInfo('');
  }, []);

  // Transform column-oriented data to row-oriented
  const transformTableData = useCallback((columnData: Record<string, any[]>) => {
    const rows = [];
    const columns = Object.keys(columnData);
    const rowCount = columnData[columns[0]].length;

    for (let i = 0; i < rowCount; i++) {
      const row: Record<string, any> = {};
      columns.forEach(column => {
        row[column] = columnData[column][i];
      });
      rows.push(row);
    }

    return rows;
  }, []);

  // Initialize Grist and set up listeners
  useEffect(() => {
    if (!isScriptLoaded) return;

    // Initialize Grist with full access
    window.grist.ready({ requiredAccess: 'full' });

    // Set up ICP table listener
    window.grist.onRecords((icpTable) => {
      setIcpList(icpTable);
    });

    // Fetch Ideas table data
    const fetchIdeas = async () => {
      try {
        const columnData = await window.grist.docApi.fetchTable('Ideas');
        const ideasTable = transformTableData(columnData);
        setIdeaList(ideasTable);
      } catch (error) {
        debugLog(`Error fetching ideas table: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    fetchIdeas();
  }, [isScriptLoaded, debugLog, transformTableData]);

  // Handle API call
  const handleCreateContent = async () => {
    if (!selectedICP || !selectedIdea) {
      alert("Please select both an ICP and an Idea.");
      return;
    }

    clearDebugLog();
    debugLog(`Notes: ${notes}`);

    const requestBody = {
      icpId: selectedICP.id,
      icpName: selectedICP.ICP_name,
      icpDescription: selectedICP.description,
      ideaId: selectedIdea.id,
      ideaName: selectedIdea.Idea_name,
      ideaExample: selectedIdea.Example,
      notes,
    };

    debugLog(`API Request Body: ${JSON.stringify(requestBody, null, 2)}`);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      debugLog(`API Response: ${JSON.stringify(data, null, 2)}`);
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      debugLog(`Error calling API: ${errorMessage}`);
      setApiResponse(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="font-sans p-8">
      <Script 
        src="https://docs.getgrist.com/grist-plugin-api.js"
        onLoad={() => setIsScriptLoaded(true)}
      />
      
      <h2 className="text-2xl font-bold mb-6">AI Content Creator</h2>

      <div className="space-y-6">
        {/* ICP Dropdown */}
        <div>
          <label htmlFor="icp-dropdown" className="block text-sm font-medium text-gray-700 mb-1">
            Select an ICP:
          </label>
          <select
            id="icp-dropdown"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedICP?.id || ''}
            onChange={(e) => {
              clearDebugLog();
              const selected = icpList.find(icp => icp.id === Number(e.target.value));
              setSelectedICP(selected || null);
              if (selected) {
                debugLog(`Selected ICP: ${selected.ICP_name}`);
                debugLog(`Selected ICP Details: ${JSON.stringify(selected, null, 2)}`);
              }
            }}
          >
            <option value="">-- Select ICP --</option>
            {icpList.map(icp => (
              <option key={icp.id} value={icp.id}>{icp.ICP_name}</option>
            ))}
          </select>
        </div>

        {/* Idea Dropdown */}
        <div>
          <label htmlFor="idea-dropdown" className="block text-sm font-medium text-gray-700 mb-1">
            Select an Idea:
          </label>
          <select
            id="idea-dropdown"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedIdea?.id || ''}
            onChange={(e) => {
              clearDebugLog();
              const selected = ideaList.find(idea => idea.id === Number(e.target.value));
              setSelectedIdea(selected || null);
              if (selected) {
                debugLog(`Selected Idea: ${selected.Idea_name}`);
                debugLog(`Selected Idea Details: ${JSON.stringify(selected, null, 2)}`);
              }
            }}
          >
            <option value="">-- Select Idea --</option>
            {ideaList.map(idea => (
              <option key={idea.id} value={idea.id}>{idea.Idea_name}</option>
            ))}
          </select>
        </div>

        {/* Notes Textarea */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes:
          </label>
          <textarea
            id="notes"
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add more directions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Create Content Button */}
        <button
          onClick={handleCreateContent}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Content
        </button>

        {/* API Response */}
        <div>
          <h3 className="text-lg font-semibold mb-2">API Response</h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[200px] text-sm">
            {apiResponse}
          </pre>
        </div>

        {/* Debug Information */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[200px] text-sm">
            {debugInfo}
          </pre>
        </div>
      </div>
    </div>
  );
}
