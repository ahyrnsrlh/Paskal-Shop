"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { useState, useEffect } from "react"

interface ProductFiltersProps {
  categories: string[]
  priceRange: { min: number; max: number }
}

export function ProductFilters({ categories, priceRange }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRange, setSelectedPriceRange] = useState([priceRange.min, priceRange.max])
  const [stockFilter, setStockFilter] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("default")

  useEffect(() => {
    // Initialize filters from URL params
    const categories = searchParams.get("categories")?.split(",") || []
    const minPrice = Number(searchParams.get("minPrice")) || priceRange.min
    const maxPrice = Number(searchParams.get("maxPrice")) || priceRange.max
    const stock = searchParams.get("stock") || ""
    const sort = searchParams.get("sort") || "default"

    setSelectedCategories(categories.filter(Boolean))
    setSelectedPriceRange([minPrice, maxPrice])
    setStockFilter(stock)
    setSortBy(sort)
  }, [searchParams, priceRange])

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Update categories
    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","))
    } else {
      params.delete("categories")
    }

    // Update price range
    if (selectedPriceRange[0] !== priceRange.min || selectedPriceRange[1] !== priceRange.max) {
      params.set("minPrice", selectedPriceRange[0].toString())
      params.set("maxPrice", selectedPriceRange[1].toString())
    } else {
      params.delete("minPrice")
      params.delete("maxPrice")
    }

    // Update stock filter
    if (stockFilter) {
      params.set("stock", stockFilter)
    } else {
      params.delete("stock")
    }

    // Update sort
    if (sortBy !== "default") {
      params.set("sort", sortBy)
    } else {
      params.delete("sort")
    }

    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("categories")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("stock")
    params.delete("sort")

    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPriceRange[0] !== priceRange.min ||
    selectedPriceRange[1] !== priceRange.max ||
    stockFilter ||
    sortBy !== "default"

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Urutkan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih urutan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="name_asc">Nama A-Z</SelectItem>
              <SelectItem value="name_desc">Nama Z-A</SelectItem>
              <SelectItem value="price_asc">Harga Terendah</SelectItem>
              <SelectItem value="price_desc">Harga Tertinggi</SelectItem>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="oldest">Terlama</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kategori</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Rentang Harga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={selectedPriceRange}
              onValueChange={setSelectedPriceRange}
              max={priceRange.max}
              min={priceRange.min}
              step={100000}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatPrice(selectedPriceRange[0])}</span>
            <span>{formatPrice(selectedPriceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stock Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ketersediaan</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={stockFilter} onValueChange={setStockFilter}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all" />
              <Label htmlFor="all">Semua</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="in_stock" id="in_stock" />
              <Label htmlFor="in_stock">Tersedia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="out_of_stock" id="out_of_stock" />
              <Label htmlFor="out_of_stock">Habis</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Apply Filters */}
      <div className="space-y-2">
        <Button onClick={updateFilters} className="w-full">
          Terapkan Filter
        </Button>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
            <X className="mr-2 h-4 w-4" />
            Hapus Semua Filter
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange(category, false)} />
                </Badge>
              ))}
              {(selectedPriceRange[0] !== priceRange.min || selectedPriceRange[1] !== priceRange.max) && (
                <Badge variant="secondary">
                  {formatPrice(selectedPriceRange[0])} - {formatPrice(selectedPriceRange[1])}
                </Badge>
              )}
              {stockFilter && <Badge variant="secondary">{stockFilter === "in_stock" ? "Tersedia" : "Habis"}</Badge>}
              {sortBy !== "default" && <Badge variant="secondary">Urutan: {sortBy.replace("_", " ")}</Badge>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
