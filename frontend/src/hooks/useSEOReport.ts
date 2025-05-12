import { useState, useEffect } from 'react';
import { fetchSEOReport, SEOReport } from '@/lib/api';

interface UseSEOReportResult {
  data: SEOReport | null;
  loading: boolean;
  error: Error | null;
  refetch: (domain: string, keywords: string) => Promise<void>;
}

export function useSEOReport(initialDomain?: string, initialKeywords?: string): UseSEOReportResult {
  const [data, setData] = useState<SEOReport | null>(null);
  const [loading, setLoading] = useState<boolean>(!!initialDomain && !!initialKeywords);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (domain: string, keywords: string) => {
    if (!domain || !keywords) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const report = await fetchSEOReport(domain, keywords);
      setData(report);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialDomain && initialKeywords) {
      fetchData(initialDomain, initialKeywords);
    }
  }, [initialDomain, initialKeywords]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}