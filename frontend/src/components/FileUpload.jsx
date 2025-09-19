import { uploadPDF } from '@/api/pdfApi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRef, useState } from 'react';

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [cacheInfo, setCacheInfo] = useState(null);
  const fileInputRef = useRef(null);

  // Generate file hash for client-side caching
  const generateFileHash = async file => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Check localStorage cache
  const checkLocalCache = fileHash => {
    try {
      const cached = localStorage.getItem(`resume_cache_${fileHash}`);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const cacheTime = new Date(parsedCache.timestamp);
        const now = new Date();
        const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);

        // Cache valid for 24 hours
        if (hoursDiff < 24) {
          return parsedCache.data;
        } else {
          // Remove expired cache
          localStorage.removeItem(`resume_cache_${fileHash}`);
        }
      }
    } catch (error) {
      console.error('Error checking cache:', error);
    }
    return null;
  };

  // Save to localStorage cache
  const saveToLocalCache = (fileHash, data) => {
    try {
      const cacheData = {
        data,
        timestamp: new Date().toISOString(),
        fileHash,
      };
      localStorage.setItem(
        `resume_cache_${fileHash}`,
        JSON.stringify(cacheData),
      );
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
      setCacheInfo(null);
    } else {
      setSelectedFile(null);
      setError('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setCacheInfo(null);

    try {
      // Generate file hash for caching
      const fileHash = await generateFileHash(selectedFile);

      // Check local cache first
      const cachedData = checkLocalCache(fileHash);
      if (cachedData) {
        console.log('📦 CLIENT CACHE HIT: Using cached data');
        setCacheInfo({
          source: 'client',
          message: 'Loaded from browser cache',
        });
        onUploadSuccess(cachedData);
        setIsUploading(false);
        return;
      }

      console.log('🔄 CLIENT CACHE MISS: Uploading to server');

      // Upload to server
      const response = await uploadPDF(selectedFile);

      // Check if server returned cached data
      if (response.cached) {
        setCacheInfo({ source: 'server', message: 'Loaded from server cache' });
      } else {
        setCacheInfo({ source: 'fresh', message: 'Processed with AI' });
        // Save fresh data to local cache
        saveToLocalCache(fileHash, response.data);
      }

      onUploadSuccess(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Failed to upload PDF. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearCache = () => {
    // Clear all resume cache from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('resume_cache_')) {
        localStorage.removeItem(key);
      }
    });
    setCacheInfo({ source: 'cleared', message: 'Browser cache cleared' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          Upload Resume
          <Button variant='outline' size='sm' onClick={clearCache}>
            Clear Cache
          </Button>
        </CardTitle>
        <CardDescription>
          Upload your PDF resume to extract information. Files are cached for
          faster processing.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Cache Info */}
        {cacheInfo && (
          <Alert variant='default'>
            <AlertTitle>
              {cacheInfo.source === 'client' && '📦 Browser Cache'}
              {cacheInfo.source === 'server' && '🖥️ Server Cache'}
              {cacheInfo.source === 'fresh' && '🤖 AI Processing'}
              {cacheInfo.source === 'cleared' && '🗑️ Cache Cleared'}
            </AlertTitle>
            <AlertDescription>{cacheInfo.message}</AlertDescription>
          </Alert>
        )}

        <div className='rounded-lg border-2 border-dashed border-gray-300 p-6 text-center'>
          <div className='space-y-4'>
            <div className='text-4xl'>📄</div>
            <div>
              <p className='text-lg font-medium'>Select your resume PDF</p>
              <p className='text-sm text-gray-500'>
                Maximum file size: 10MB • Cached for faster processing
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type='file'
              accept='.pdf'
              onChange={handleFileSelect}
              className='mx-auto max-w-xs'
            />
          </div>
        </div>

        {selectedFile && (
          <Alert>
            <AlertTitle>File Selected</AlertTitle>
            <AlertDescription>
              <strong>{selectedFile.name}</strong> (
              {formatFileSize(selectedFile.size)})
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant='destructive'>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='flex justify-center'>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className='px-8'
          >
            {isUploading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                Processing...
              </>
            ) : (
              'Extract Resume Data'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
