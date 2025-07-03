"use client"

import type React from "react"

import { Search } from "lucide-react"
import { X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { SearchSuggestions } from "./search-suggestions"
import { useRef } from "react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    onSearch(query)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Cari produk..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-10 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg bg-white"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-md"
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          )}
        </div>
      </form>

      <SearchSuggestions
        query={query}
        onSelect={(suggestion) => {
          setQuery(suggestion)
          setShowSuggestions(false)
        }}
        isVisible={showSuggestions}
      />
    </div>
  )
}
