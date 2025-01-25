declare global {
  interface Window {
    grist: {
      ready: () => void;
      onRecord: (callback: (record: any) => void) => void;
      // Add more Grist API methods as needed
    };
  }
}

export type GristRecord = Record<string, any>;

// Prevent TypeScript from treating this file as a module
export {};
