"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, XCircle } from "lucide-react"

interface SeriesCardProps {
  series: any
  members: any[]
  currentUserId: string
  userCompleted: boolean
  onToggleCompletion: (seriesId: string) => void
}

export function SeriesCard({ series, members, currentUserId, userCompleted, onToggleCompletion }: SeriesCardProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <img
            src={series.seriesId.poster || "/placeholder.svg"}
            alt={series.seriesId.title}
            className="w-24 h-36 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-semibold text-white">
                {series.seriesId.title} ({series.seriesId.year})
              </h3>
              <button onClick={() => onToggleCompletion(series.seriesId.id)} className="transition-all hover:scale-105">
                {userCompleted ? (
                  <Badge className="bg-green-600 text-white border-green-500 cursor-pointer hover:bg-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-gray-500 text-gray-400 cursor-pointer hover:border-green-500 hover:text-green-400"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    In Progress
                  </Badge>
                )}
              </button>
            </div>

            {/* Episode Progress */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Episode Progress</h4>
              {series.episodeProgress.map((episode : any, index : number) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">
                      S{episode.seasonNumber}E{episode.episodeNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      {episode.reactions.map((reaction : any, i : number) => (
                        <span key={i} className="text-sm">
                          {reaction}
                        </span>
                      ))}
                      {episode.pollRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-300">{episode.pollRating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {episode.comments && episode.comments.length > 0 && (
                    <div className="mt-2 relative">
                      <div className={`${!userCompleted ? "blur-sm" : ""}`}>
                        {episode.comments.map((comment : any, commentIndex : number) => {
                          const user = members.find((m) => m.id === comment.userId)
                          return (
                            <div key={commentIndex} className="text-xs text-gray-400 mt-1">
                              <span className="font-medium">{user?.name}:</span> {comment.text}
                            </div>
                          )
                        })}
                      </div>
                      {!userCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-gray-900/90 px-2 py-1 rounded text-xs text-red-400">
                            🚫 Spoiler protected
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
