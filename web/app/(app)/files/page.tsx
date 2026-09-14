'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Trash2, File, Loader2, ExternalLink } from 'lucide-react';
import { filesApi } from '@/lib/api/domain';
import { UploadedFile } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/lib/context/ToastContext';

export default function FilesPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const file = selectedFiles[0];
    setUploading(true);
    try {
      const res = await filesApi.upload(file);
      if (res.data) {
        setFiles((prev) => [res.data, ...prev]);
        toast(`Uploaded ${file.name} successfully`, 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'File upload failed';
      toast(msg, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await filesApi.deleteFile(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast('File removed', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove file';
      toast(msg, 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Storage & Asset Manager</h2>
        <p className="text-sm text-zinc-500">
          Upload and organize documents, images, and attachments linked to your operational items.
        </p>
      </div>

      {/* Drag and Drop / Select Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-10 border-2 border-dashed border-zinc-200 hover:border-zinc-400 bg-white rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all">
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-zinc-800">
            {uploading ? 'Streaming file to backend storage...' : 'Click or drop files to upload'}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">Supports PDF, PNG, JPG up to 20MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
        />
      </div>

      {/* Uploaded Files Feed */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <h3 className="text-sm font-bold text-zinc-900">Uploaded Assets in Current Session</h3>
        </div>

        {files.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-400">
            No assets uploaded yet in this web session. Upload a document or image above.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {files.map((file) => (
              <div key={file.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-zinc-100 text-zinc-600 flex-shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 truncate">{file.originalName}</p>
                    <p className="text-[11px] text-zinc-400">
                      {(file.size / 1024).toFixed(1)} KB • {file.mimeType} • {formatDate(file.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {file && (
                    <a
                      href={(() => {
                        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://code-a-thon-9xqm.onrender.com/api';
                        const token = typeof window !== 'undefined' ? (localStorage.getItem('app_web_token') || localStorage.getItem('pulse_web_token')) : '';
                        const downloadPath = file.downloadUrl || `/files/download/${file.id}`;
                        const fullUrl = downloadPath.startsWith('http') 
                          ? downloadPath 
                          : `${baseUrl.replace(/\/api$/, '')}${downloadPath.startsWith('/') ? '' : '/'}${downloadPath}`;
                        return token ? `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}token=${token}` : fullUrl;
                      })()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                      title="Open file"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
