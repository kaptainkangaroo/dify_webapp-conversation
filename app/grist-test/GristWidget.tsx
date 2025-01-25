'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import type { GristRecord } from '@/types/grist';

export default function GristWidget() {
  const [record, setRecord] = useState<GristRecord | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (!isScriptLoaded) return;

    // Initialize Grist widget
    window.grist.ready();
    
    // Subscribe to record updates
    window.grist.onRecord((newRecord) => {
      setRecord(newRecord);
    });
  }, [isScriptLoaded]);

  return (
    <div className="p-4">
      <Script 
        src="https://docs.getgrist.com/grist-plugin-api.js"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Grist Record Data</h2>
        {record ? (
          <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-[500px]">
            {JSON.stringify(record, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">Waiting for data...</p>
        )}
      </div>
    </div>
  );
}
