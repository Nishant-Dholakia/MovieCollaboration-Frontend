"use client"

import { useState, useEffect } from "react";
import api from "@/api/axios";
import { useDebounce } from "@/hooks/useDebounce";
import type { Movie, Series, Group, Watchlist } from "@/interfaces/interfaces";
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
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState<SearchResultItem | null>(null);
  const [adminGroups, setAdminGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch search results from backend / OMDB wrapper
  useEffect(() => {
    if (!debouncedQuery) return setResults([]);

    setLoading(true);
    api.get(`/movie/search?name=${debouncedQuery}`)
      .then(res => {
        console.log(res.data.data.Search);
        setResults(res.data.data.Search);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, [debouncedQuery]);

  // Fetch user's admin groups
  useEffect(() => {
    api.get("/groups/admin")
      .then(res => setAdminGroups(res.data.data))
      .catch(err => console.error(err));
  }, []);

  const openModal = (item: SearchResultItem) => {
    setSelectedItem(item);
    setSelectedGroups([]);
    setModalOpen(true);
  }

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  }

  const saveToWatchlists = async () => {
    if (!selectedItem || selectedGroups.length === 0) {
      toast.error("Select at least one group");
      return;
    }

    try {
      console.log("Saving to groups:", selectedItem);
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
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Search Movies & Series</h1>

      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search for movies or series..."
        className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600"
      />

      {loading && <p className="mt-2">Loading...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {results?.map(item => (
          <div key={item.id} onClick={() => openModal(item)}
               className="cursor-pointer bg-gray-800 rounded overflow-hidden hover:scale-105 transition-transform">
            <img src={item.Poster} alt={item.Title} className="w-full h-48 object-cover"/>
            <div className="p-2">
              <h3 className="font-bold text-sm">{item.Title}</h3>
              <p className="text-xs text-gray-400">{item.Year} | {item.Type}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <div className="bg-black-800 p-6 rounded max-w-lg mx-auto mt-24">
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
