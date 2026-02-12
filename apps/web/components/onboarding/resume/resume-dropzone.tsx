"use client";

import { useState, useCallback, useRef } from "react";
import { DocumentText, CloseCircle } from "@hackhyre/ui/icons";
import { cn } from "@hackhyre/ui/lib/utils";

const ACCEPTED = ".pdf,.doc,.docx";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface ResumeDropzoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function ResumeDropzone({ onFileSelect, disabled }: ResumeDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document.");
      return false;
    }
    if (file.size > MAX_SIZE) {
      setError("File is too large. Maximum size is 5MB.");
      return false;
    }
    setError(null);
    return true;
  }, []);

  function handleFile(file: File) {
    if (validate(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleClear() {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "border-border flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
          isDragging && "border-primary bg-primary/5",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
          <DocumentText size={24} variant="Bulk" className="text-primary" />
        </div>

        {selectedFile ? (
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{selectedFile.name}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <CloseCircle size={16} variant="Bold" />
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm font-medium">
              Drop your resume here or{" "}
              <span className="text-primary">browse</span>
            </p>
            <p className="text-muted-foreground text-xs">
              PDF or Word document, up to 5MB
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <p className="text-destructive text-xs">{error}</p>
      )}
    </div>
  );
}
