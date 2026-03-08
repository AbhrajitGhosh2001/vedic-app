"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

interface PersonalInfoData {
  first_name: string
  last_name: string
  gender: 'male' | 'female' | 'other'
  bio: string
  profile_image_url: string
}

interface PersonalInfoStepProps {
  initialData: PersonalInfoData
  onNext: (data: PersonalInfoData) => void
}

export function PersonalInfoStep({ initialData, onNext }: PersonalInfoStepProps) {
  const [data, setData] = useState<PersonalInfoData>(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.first_name.trim()) {
      onNext(data)
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-light">Tell Us About Yourself</CardTitle>
        <CardDescription>This information helps us find your cosmic match</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="First name"
                value={data.first_name}
                onChange={(e) => setData({ ...data, first_name: e.target.value })}
                className="bg-input border-border/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name (Optional)</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={data.last_name}
                onChange={(e) => setData({ ...data, last_name: e.target.value })}
                className="bg-input border-border/50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="flex gap-2">
              {(['female', 'male', 'other'] as const).map((gender) => (
                <Button
                  key={gender}
                  type="button"
                  variant={data.gender === gender ? "default" : "outline"}
                  size="sm"
                  onClick={() => setData({ ...data, gender })}
                  className="flex-1 capitalize"
                >
                  {gender}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">About You (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Share a little about yourself, your interests, and what you're looking for..."
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              className="bg-input border-border/50 min-h-[100px]"
              rows={4}
            />
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
