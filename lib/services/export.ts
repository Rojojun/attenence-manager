import type { ExportQueryParams } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const exportService = {
  // 19. Export program data as Excel or PDF
  async exportProgram(programId: string, params: ExportQueryParams): Promise<Blob> {
    const queryParams = new URLSearchParams();
    queryParams.append('format', params.format);

    const url = `${API_BASE_URL}/api/export/${programId}?${queryParams.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status} ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Export request failed:', error);
      throw error;
    }
  },

  // Helper function to download the exported file
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // Combined export and download
  async exportAndDownload(
    programId: string,
    format: 'excel' | 'pdf',
    programName: string = 'program'
  ): Promise<void> {
    const blob = await this.exportProgram(programId, { format });
    const extension = format === 'excel' ? 'xlsx' : 'pdf';
    const filename = `${programName}_${new Date().toISOString().split('T')[0]}.${extension}`;
    this.downloadFile(blob, filename);
  },
};
