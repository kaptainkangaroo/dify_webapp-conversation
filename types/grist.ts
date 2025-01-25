declare global {
  interface Window {
    grist: {
      ready: (options?: { requiredAccess: 'full' | 'read-only' }) => void;
      onRecord: (callback: (record: any) => void) => void;
      onRecords: (callback: (records: any[]) => void) => void;
      docApi: {
        fetchTable: (tableName: string) => Promise<Record<string, any[]>>;
      };
    };
  }
}

export interface ICPRecord {
  id: number;
  ICP_name: string;
  description?: string;
}

export interface IdeaRecord {
  id: number;
  Idea_name: string;
  Example?: string;
}

export type GristRecord = Record<string, any>;

// Prevent TypeScript from treating this file as a module
export {};
