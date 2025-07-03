"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp } from "lucide-react";
import Image from "next/image";

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
}

interface Suggestion {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

export function SearchSuggestions({
  query,
  onSelect,
  isVisible,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [popularSearches] = useState([
    "Kain tapis",
    "Tas tapis",
    "Dompet tapis",
    "Miniatur rumah",
    "Tapis Lampung",
    "Kerajinan ukiran",
  ]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true);
      const debounceTimer = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/products/suggestions?q=${encodeURIComponent(query)}`
          );
          if (response.ok) {
            const data = await response.json();
            setSuggestions(data.suggestions || []);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const handleSearchClick = (searchQuery: string) => {
    onSelect(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  if (!isVisible) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
      <CardContent className="p-0">
        {loading && (
          <div className="p-4 text-center text-muted-foreground">
            Mencari...
          </div>
        )}

        {query.length >= 2 && suggestions.length > 0 && (
          <div>
            <div className="p-3 border-b bg-muted/50">
              <h4 className="text-sm font-medium text-muted-foreground">
                Produk
              </h4>
            </div>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleProductClick(suggestion.id)}
                className="flex items-center space-x-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
              >
                <div className="w-10 h-10 relative flex-shrink-0">
                  <Image
                    src={
                      suggestion.image || "/placeholder.svg?height=40&width=40"
                    }
                    alt={suggestion.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {suggestion.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-green-600">
                      {formatPrice(suggestion.price)}
                    </span>
                    {suggestion.category && (
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {query.length >= 2 && suggestions.length === 0 && !loading && (
          <div className="p-4">
            <div
              onClick={() => handleSearchClick(query)}
              className="flex items-center space-x-2 p-2 hover:bg-muted/50 cursor-pointer rounded"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Cari "{query}"</span>
            </div>
          </div>
        )}

        {query.length < 2 && (
          <div>
            <div className="p-3 border-b bg-muted/50">
              <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Pencarian Populer
              </h4>
            </div>
            {popularSearches.map((search) => (
              <div
                key={search}
                onClick={() => handleSearchClick(search)}
                className="flex items-center space-x-2 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{search}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
