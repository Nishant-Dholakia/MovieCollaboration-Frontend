"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, Link2, Settings } from "lucide-react"

interface GroupHeaderProps {
  groupName: string
  groupDescription: string
}

export function GroupHeader({ groupName, groupDescription }: GroupHeaderProps) {
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
    </div>
  )
}
