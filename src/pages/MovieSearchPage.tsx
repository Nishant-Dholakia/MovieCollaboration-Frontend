"use client"

import { useState, useEffect } from "react";
import api from "@/api/axios";
import { useDebounce } from "@/hooks/useDebounce";
import type { Group } from "@/interfaces/interfaces";
import { Dialog } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface SearchResultItem {
  id: string;
  Title: string;
  Year: string;
  Poster?: string;
  Type: "movie" | "series";
}

export const MovieSearchPage = () => {
  const [query, setQuery] = useState({ name: "", type: "movie" });
  const debouncedQuery = useDebounce(query, 500);

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(null);
  const [adminGroups, setAdminGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Cache for previous search results
  const [cache, setCache] = useState<{ [key: string]: SearchResultItem[] }>({});

  // Fetch search results with cache
  useEffect(() => {
    if (!debouncedQuery.name) return setResults([]);

    const cacheKey = JSON.stringify({ name: debouncedQuery.name.toLowerCase(), type: debouncedQuery.type });

    if (cache[cacheKey]) {
      setResults(cache[cacheKey]);
      return;
    }

    setLoading(true);
    api
      .get(`/movie/search?name=${debouncedQuery.name}&type=${debouncedQuery.type}`)
      .then(res => {
        const fetchedResults = res.data.data.Search || [];
        console.log("Fetched results:", fetchedResults);
        setResults(fetchedResults);
        setCache(prev => ({ ...prev, [cacheKey]: fetchedResults }));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [debouncedQuery, cache]);

  // Fetch admin groups
  useEffect(() => {
    api
      .get("/groups/admin")
      .then(res => setAdminGroups(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const openModal = (item: SearchResultItem) => {
    setSelectedItem(item);
    setSelectedGroups([]);
    setModalOpen(true);
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const saveToWatchlists = async () => {
    if (!selectedItem || selectedGroups.length === 0) {
      toast.error("Select at least one group");
      return;
    }

    try {
      await api.post("/watchlist/add", {
        groupIds: selectedGroups,
        item: selectedItem
      });
      toast.success("Added to selected groups!");
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to watchlist");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Search Movies & Series</h1>

      <div className="flex flex-col items-center mt-6">
        <input
          type="text"
          value={query.name}
          onChange={e => setQuery({ ...query, name: e.target.value })}
          placeholder="Search for movies or series..."
          className="w-[80vw] max-w-md p-3 rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        <div className="flex mt-4 space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="movie"
              checked={query.type === "movie"}
              onChange={() => setQuery({ ...query, type: "movie" })}
              className="w-4 h-4 accent-red-600"
            />
            <span className="text-white">Movies</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="series"
              checked={query.type === "series"}
              onChange={() => setQuery({ ...query, type: "series" })}
              className="w-4 h-4 accent-red-600"
            />
            <span className="text-white">Series</span>
          </label>
        </div>
      </div>

      {loading && <p className="mt-2">Loading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {results?.map(item => (
          <div
            key={item.id}
            onClick={() => openModal(item)}
            className="cursor-pointer bg-gray-800 rounded overflow-hidden hover:scale-105 transition-transform"
          >
            <img src={item.Poster} alt={item.Title} className="w-full h-48 object-cover" />
            <div className="p-2">
              <h3 className="font-bold text-sm">{item.Title}</h3>
              <p className="text-xs text-gray-400">{item.Year} | {item.Type}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <div className="bg-gray-800 p-6 rounded max-w-lg mx-auto mt-24">
          <h2 className="text-xl font-bold mb-4">{selectedItem?.Title}</h2>
          <p className="text-sm text-gray-300 mb-4">Year: {selectedItem?.Year} | Type: {selectedItem?.Type}</p>

          <h3 className="font-medium mb-2">Select groups to add:</h3>
          <div className="space-y-2 mb-4">
            {adminGroups.map(group => (
              <label key={group._id} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedGroups.includes(group._id)}
                  onCheckedChange={() => toggleGroupSelection(group._id)}
                />
                {group.name}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalOpen(false)} variant="secondary">Cancel</Button>
            <Button onClick={saveToWatchlists}>Save</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
