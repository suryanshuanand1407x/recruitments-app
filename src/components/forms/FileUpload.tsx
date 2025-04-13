'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function FileUpload({ 
  type, 
  onUpload 
}: { 
  type: 'jd' | 'cv',
  onUpload?: (file: File) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  
  // For manual input (JD only)
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [description, setDescription] = useState('')
  const [manualInput, setManualInput] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    const selectedFile = fileList[0]
    
    // Validate file type
    const validTypes = type === 'jd' 
      ? ['.pdf', '.docx', '.doc', '.txt'] 
      : ['.pdf', '.docx', '.doc']
    
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()
    const isValidType = fileExtension && validTypes.includes(`.${fileExtension}`)
    
    if (!isValidType) {
      setError(`Invalid file type. Please upload ${validTypes.join(', ')} files.`)
      return
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit.')
      return
    }
    
    setFile(selectedFile)
    setError('')
  }

  const handleUpload = async () => {
    if (!file && !manualInput) {
      setError('Please select a file to upload or enter details manually.')
      return
    }
    
    if (manualInput && (!title || !description)) {
      setError('Please fill in all required fields.')
      return
    }
    
    setIsUploading(true)
    setError('')
    
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      // This would be replaced with actual upload logic
      if (file && onUpload) {
        onUpload(file)
      } else if (manualInput) {
        console.log('Manual input:', { title, company, description })
        // Handle manual input submission
      }
      
      // Reset form after successful upload
      setFile(null)
      setTitle('')
      setCompany('')
      setDescription('')
      setManualInput(false)
      setUploadProgress(0)
    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {type === 'jd' ? 'Upload Job Description' : 'Upload Resume/CV'}
        </CardTitle>
        <CardDescription>
          {type === 'jd' 
            ? 'Upload a job description file or enter details manually' 
            : 'Upload your resume or CV to find matching jobs'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {type === 'jd' && (
          <div className="flex items-center space-x-2 mb-4">
            <Button 
              variant={manualInput ? "default" : "outline"} 
              onClick={() => setManualInput(false)}
              type="button"
            >
              Upload File
            </Button>
            <Button 
              variant={manualInput ? "outline" : "default"} 
              onClick={() => setManualInput(true)}
              type="button"
            >
              Enter Manually
            </Button>
          </div>
        )}
        
        {!manualInput ? (
          <>
            <div 
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileInput}
                accept={type === 'jd' ? '.pdf,.docx,.doc,.txt' : '.pdf,.docx,.doc'}
              />
              
              {file ? (
                <div className="py-4">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="mb-2">
                    <svg
                      className="mx-auto h-12 w-12 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">
                    Drag and drop your file here or click to browse
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {type === 'jd' 
                      ? 'Supports PDF, Word, and text files (max 5MB)' 
                      : 'Supports PDF and Word documents (max 5MB)'}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. Senior Software Engineer" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                placeholder="e.g. Acme Inc." 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter the full job description including requirements and responsibilities..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px]"
                required
              />
            </div>
          </div>
        )}
        
        {isUploading && (
          <div className="mt-4">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-center mt-1 text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
        
        <Button 
          onClick={handleUpload} 
          className="w-full mt-4" 
          disabled={isUploading || (!file && !manualInput) || (manualInput && (!title || !description))}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </CardContent>
    </Card>
  )
}
