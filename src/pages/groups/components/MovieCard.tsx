"use client"

import { useState } from "react"
import { Card, CardContent } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Progress } from "../../../components/ui/progress"
import { MessageCircle, ChevronDown, ChevronUp, Star, CheckCircle, XCircle } from "lucide-react"
import type {  MovieListItem, User } from "@/interfaces/interfaces"

interface MovieCardProps {
  movie: MovieListItem
  members: User[]
  currentUserId: string
  userCompleted: boolean
  onToggleCompletion: (movieId: string) => void
}

export function MovieCard({ movie, members, currentUserId, userCompleted, onToggleCompletion }: MovieCardProps) {
  const [showComments, setShowComments] = useState(false);

  const getCompletionPercentage = (userProgress: any[]) => {
    const completed = userProgress.filter((up) => up.completed).length
    return Math.round((completed / members.length) * 100)
  }

  const getAverageRating = (userProgress: any[]) => {
    const ratings = userProgress.filter((up) => up.pollRating).map((up) => up.pollRating)
    if (ratings.length === 0) return 0
    return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
  }

  const getReactionCounts = (userProgress: any[]) => {
    const reactions: { [key: string]: number } = {}
    userProgress.forEach((up) => {
      up.reactions.forEach((reaction: string) => {
        reactions[reaction] = (reactions[reaction] || 0) + 1
      })
    })
    return reactions
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex gap-6">
          <img
            src={movie.movieId.poster || "/placeholder.svg"}
            alt={movie.movieId.title}
            className="w-24 h-36 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-white">
                  {movie.movieId.title} ({movie.movieId.year})
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleCompletion(movie.movieId._id)}
                    className="transition-all hover:scale-105"
                  >
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
                        Not Watched
                      </Badge>
                    )}
                  </button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="text-gray-400 hover:text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {movie.comments.length}
                {showComments ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </div>

            {/* Progress Section */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Completion Progress</span>
                  <span className="text-sm text-gray-300">
                    {movie.userProgress.filter((up) => up.completed).length}/{members.length} members
                  </span>
                </div>
                <Progress value={getCompletionPercentage(movie.userProgress)} className="h-2 bg-gray-700" />
              </div>

              {/* Reactions */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-300">Reactions:</span>
                <div className="flex gap-2">
                  {Object.entries(getReactionCounts(movie.userProgress)).map(([reaction, count]) => (
                    <Badge key={reaction} variant="secondary" className="bg-gray-700 text-white">
                      {reaction} {count}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-300">{getAverageRating(movie.userProgress)}/5</span>
                </div>
              </div>
            </div>

            {showComments && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Comments</h4>
                <div className="relative">
                  <div className={`space-y-3 ${!userCompleted ? "blur-sm" : ""}`}>
                    {movie.comments.map((comment, index) => {
                      const user = members.find((m) => m._id === comment.userId)
                      return (
                        <div key={index} className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-white">{user?.username}</span>
                              <span className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-300">{comment.text}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {!userCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-gray-900/90 px-4 py-2 rounded-lg border border-red-500">
                        <p className="text-red-400 text-sm font-medium">
                          🚫 Complete watching to see comments (spoiler protection)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
