import React, { useState, useEffect, useContext } from "react";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GroupCard from "./GroupCard";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import type { Group } from "../../interfaces/interfaces";


const GroupsListPage: React.FC = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { user } = authContext || {};

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const response  = await api.get("/group/all",{ withCredentials: true });
      console.log(response.data.data);
      setGroups(response.data.data);
      // console.log('groups ',groups);


    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    navigate("/groups/create");
    console.log("Navigate to create group page");
  };

  const handleGroupClick = (groupId: string) => {
    // navigate(`/groups/${groupId}`);
    console.log("Navigate to group:", groupId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold text-white">My Groups</h1>
          </div>
          <p className="text-gray-300">Connect with fellow movie enthusiasts and share your passion for cinema</p>
        </div>

        {/* Groups Grid */}
        {groups === undefined || groups.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Groups Yet</h2>
            <p className="text-gray-400 mb-6">Create your first group to start connecting with other movie lovers</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {groups.map((group) => (
               <GroupCard
                key={group._id}
                group={group}
                onClick={() => handleGroupClick(group._id)}
              />
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <button
            type="button"
            onClick={handleCreateGroup}
            aria-label="Create group"
            className="w-14 h-14 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full shadow-2xl hover:shadow-red-900/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
          >
            <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupsListPage;