import React, { useState, useEffect } from 'react';
import { Button, FileInput, Notification, Group, Text } from '@mantine/core';
import { IconUpload, IconFileSpreadsheet } from '@tabler/icons-react';
import api from '../services/api';

const CsvUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage(null);
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const handleFileChange = (selectedFile) => {
        setFile(selectedFile);
        setMessage(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a CSV file first.");
            return;
        }

        // Fixed the capitalization issue
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Fixed the typos in the header
            const response = await api.post('/upload_csv', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage(response.data.message);
            setFile(null);
            
            // Call the callback to refresh expense list
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            setError(err.response?.data?.error || "An error occurred while uploading.");
        }
    };

    return (
        <Group spacing="sm" align="center">
            <Text fw={500} size="sm">Or import expenses:</Text>
            <FileInput
                placeholder="Choose CSV file"
                accept=".csv"
                value={file}
                onChange={handleFileChange}
                style={{ width: "220px" }}
            />
            <Button 
                onClick={handleUpload} 
                color="blue" 
                variant="light"
            >
                Import CSV
            </Button>
            {message && <Notification color="green" onClose={() => setMessage(null)}>{message}</Notification>}
            {error && <Notification color="red" onClose={() => setError(null)}>{error}</Notification>}
        </Group>
    );
};

export default CsvUpload;