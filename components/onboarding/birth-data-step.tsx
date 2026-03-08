"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, Info, Loader2 } from "lucide-react"
import type { BirthData, VedicChart } from "@/lib/types"
import { calculateVedicChart } from "@/lib/birth-chart"

interface CityResult {
  name: string
  latitude: number
  longitude: number
}

interface BirthDataStepProps {
  onNext: (data: BirthData, chart: VedicChart) => void
  onBack: () => void
}

export function BirthDataStep({ onNext, onBack }: BirthDataStepProps) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<CityResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const filteredCities = suggestions.filter(city => city.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Debounced search using OpenStreetMap Nominatim API
  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&featuretype=city`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const cities: CityResult[] = data.map((item: { display_name: string; lat: string; lon: string }) => ({
          name: item.display_name.split(',').slice(0, 3).join(','),
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon)
        }))
        setSuggestions(cities)
      }
    } catch (error) {
      console.error('Error searching cities:', error)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && !selectedCity) {
        searchCities(searchQuery)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedCity, searchCities])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date || !time || !selectedCity) return
    
    const birthData: BirthData = {
      date,
      time,
      location: {
        city: selectedCity.name,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude
      }
    }
    
    const vedicChart = calculateVedicChart(birthData)
    onNext(birthData, vedicChart)
  }

  const handleCitySelect = (city: CityResult) => {
    setSelectedCity(city)
    setSearchQuery(city.name)
    setShowSuggestions(false)
    setSuggestions([])
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setShowSuggestions(true)
    // Clear selected city when typing to allow new search
    if (selectedCity && value !== selectedCity.name) {
      setSelectedCity(null)
    }
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
    if (searchQuery.length >= 2 && !selectedCity) {
      searchCities(searchQuery)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding to allow click on suggestion
    setTimeout(() => setShowSuggestions(false), 200)
  }

  return (
    <Card className="bg-card/80 backdrop-blur border-border/50">
      <CardHeader>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="w-fit -ml-2 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-2xl font-light">Your Birth Details</CardTitle>
        <CardDescription>Exact birth time is crucial for accurate Nakshatra calculation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date of Birth</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-input border-border/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="time">Time of Birth</Label>
              <div className="group relative">
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 border border-border">
                  Accurate to ±2 minutes affects Moon sign & Nakshatra
                </div>
              </div>
            </div>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-input border-border/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="citySearch">Birth Location</Label>
            <div className="relative">
              <Input
                id="citySearch"
                placeholder="Search any city worldwide..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="bg-input border-border/50"
                autoComplete="off"
              />
              
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((city, index) => (
                    <button
                      key={`${city.name}-${index}`}
                      type="button"
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-2 hover:bg-accent/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="font-medium text-sm">{city.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {city.latitude.toFixed(4)}°N, {city.longitude.toFixed(4)}°E
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {showSuggestions && searchQuery.length >= 2 && !isSearching && suggestions.length === 0 && !selectedCity && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
                  No cities found. Try a different search term.
                </div>
              )}
            </div>
            
            {selectedCity && (
              <div className="mt-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm">
                  <span className="font-medium text-primary">Selected:</span> {selectedCity.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Coordinates: {selectedCity.latitude.toFixed(4)}°, {selectedCity.longitude.toFixed(4)}°
                </p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Start typing to search any city, town, or village worldwide
            </p>
          </div>
          
          <div className="pt-4 space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-medium">Why accuracy matters:</span> In Vedic astrology, 
                the Moon moves approximately 13° per day. Even a small time difference can change your 
                Nakshatra, which is the foundation of compatibility calculations.
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={!date || !time || !selectedCity}
            >
              Calculate My Chart
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
