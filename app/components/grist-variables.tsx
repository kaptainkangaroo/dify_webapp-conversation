import React, { useEffect, useState } from 'react';
import styles from './grist-variables.module.css';

export const GristVariables = () => {
    const [record, setRecord] = useState<any>(null);
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.grist?.ready();
            window.grist?.onRecord((record) => {
                setRecord(record);
                setRecords([]);
            });
            window.grist?.onRecords((records) => {
                setRecords(records);
                setRecord(null);
            });
        }
    }, []);

    return (
        <div className={styles.gristVariables}>
            <h2>Grist Variables</h2>
            <div className={styles.variablesContainer}>
                {record && (
                    <pre>{JSON.stringify(record, null, 2)}</pre>
                )}
                {records.length > 0 && (
                    <pre>{JSON.stringify(records, null, 2)}</pre>
                )}
                {!record && records.length === 0 && (
                    <p>Variables will appear here when loaded</p>
                )}
            </div>
        </div>
    );
};
