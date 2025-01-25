declare interface Grist {
    ready(): void;
    onRecord(callback: (record: any) => void): void;
    onRecords(callback: (records: any[]) => void): void;
}

interface Window {
    grist?: Grist;
}
