import React from "react";
import { Users, Crown} from "lucide-react";
import type { Group } from "@/interfaces/interfaces";



interface GroupCardProps {
  group: Group;
  onClick: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
    console.log('group ',group);
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

   return (
    <div
      onClick={onClick}
      className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-2xl hover:shadow-red-900/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
    >
      {/* Group Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-200 capitalize line-clamp-2 leading-tight break-words word-break">
            {group.name}
          </h3>
          <p className="text-gray-400 text-sm">{group.members.length} member{group.members.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      
      {/* Group Description */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm leading-relaxed">
          {group.description 
            ? truncateDescription(group.description)
            : "No description available"
          }
        </p>
      </div>

      {/* Member Avatars Preview */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {group.members.slice(0, 4).map((member, index) => (
              <div
                key={member._id}
                className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                style={{ zIndex: 4 - index }}
              >
                {member.username.charAt(0).toUpperCase()}
              </div>
            ))}
            {group.members.length > 4 && (
              <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-xs font-medium">
                +{group.members.length - 4}
              </div>
            )}
          </div>
          {group.members.length > 1 && (
            <span className="text-gray-500 text-xs ml-2">
              {group.members.length > 4 ? `and ${group.members.length - 4} more` : 'members'}
            </span>
          )}
        </div>
      </div>
      
      {/* Group Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        
        <div className="flex items-center gap-1">
          <Crown className="w-3 h-3" />
          <span>{group.admins.length} admin{group.admins.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <p className="text-red-400 text-sm font-medium text-center">
          Click to enter group →
        </p>
      </div>
    </div>
  );
};

export default GroupCard;