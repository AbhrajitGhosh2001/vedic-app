'use client'

import React from "react"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { uploadProfileImage } from '@/app/actions/profile'

interface ProfileImageStepProps {
  onNext: (imageUrl: string) => void
  onBack: () => void
}

export function ProfileImageStep({ onNext, onBack }: ProfileImageStepProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await uploadProfileImage(file)

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.imageUrl) {
        setImageUrl(result.imageUrl)
      }
    } catch (err) {
      setError('Failed to upload image')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    onNext('') // Skip with no image
  }

  const handleContinue = () => {
    if (imageUrl) {
      onNext(imageUrl)
    } else {
      handleSkip()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Profile Photo</CardTitle>
        <CardDescription>
          Upload a beautiful photo to help others connect with you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center gap-6">
          {imageUrl ? (
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary">
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt="Profile preview"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-48 h-48 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary/60 transition-colors bg-primary/5"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm text-muted-foreground">Click to upload</p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {imageUrl && (
            <Button
              variant="outline"
              onClick={() => {
                setImageUrl(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            >
              Change Photo
            </Button>
          )}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Uploading...' : imageUrl ? 'Continue' : 'Skip Photo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
