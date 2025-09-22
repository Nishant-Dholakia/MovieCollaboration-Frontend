"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Users, Crown } from "lucide-react"

export interface Member {
  id: string
  name: string
  avatar: string
  isAdmin: boolean
}

interface MembersSidebarProps {
  members: Member[]
}

export function MembersSidebar({ members }: MembersSidebarProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm sticky top-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={member.avatar || "/placeholder.svg"} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{member.name}</span>
                {member.isAdmin && <Crown className="w-4 h-4 text-yellow-500" />}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
