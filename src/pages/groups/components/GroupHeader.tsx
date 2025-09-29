"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Link2, Settings, X } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "@/api/axios";
import Modal from "./Modal";

interface GroupHeaderProps {
  groupName: string;
  groupDescription: string;
  groupId: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

export function GroupHeader({ groupName, groupDescription, groupId }: GroupHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Search users when typing
  useEffect(() => {
    if (!query) return setResults([]);

    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(`/user/similar`, {
          params: { username: query },
        });
        const data: User[] = res.data.data;
        setResults(data);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleAddMember = async () => {
    if (!selectedUser) {
      toast.error("Select a user!");
      return;
    }

    try {
      const res = await api.post(`/groups/addMember`, {
        groupId,
        userId: selectedUser._id,
      });
      const data = res.data;
      console.log("Add member response:", res);
      if (res.status === 200 && data.success) {
        toast.success(`Added ${selectedUser.username} to the group!`);
        setSelectedUser(null);
        setQuery("");
        setResults([]);
        setIsModalOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message || "Failed to add member");
      }
    } catch (err : any) {
      console.error(err);
      toast.error("Error : " + (err.response.data.message || "Failed to add member"));
    }
  };

  return (
    <div className="border-b border-gray-700 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{groupName}</h1>
            <p className="text-gray-300">{groupDescription}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
              onClick={() => setIsModalOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              <Link2 className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

<Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Member"
      >
        <input
          type="text"
          placeholder="Search by username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 mb-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        {results.length > 0 && (
          <div className="max-h-40 overflow-y-auto bg-gray-800 rounded mb-4 relative z-[1000001]">
            {results.map((user) => (
              <div
                key={user._id}
                className={`p-2 cursor-pointer hover:bg-gray-700 ${
                  selectedUser?._id === user._id ? "bg-gray-700" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                {user.username} ({user.email})
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={handleAddMember}
          className="w-full bg-red-500 hover:bg-red-600"
        >
          Add
        </Button>
      </Modal>
    </div>
  );
}
