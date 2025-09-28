"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle, XCircle, ChevronDown, ChevronRight, Users } from "lucide-react"

// Interfaces (same as your existing ones)
interface Comment {
  userId: string;
  text: string;
  timestamp: string;
}

interface EpisodeProgress {
  seasonNumber: number;
  episodeNumber: number;
  userId: string;
  completed: boolean;
  reactions: Array<'🔥' | '😂' | '❤️' | '😢' | '😡'>;
  pollRating?: number;
  comments: Comment[];
}

interface Episode {
  episodeNumber: number;
  title?: string;
  imdbID?: string;
  imdbRating?: string;
  released?: string;
  runtime?: string;
  plot?: string;
  poster?: string;
  genre?: string[];
}

interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

interface Series {
  _id: string;
  omdbId: string;
  title: string;
  poster?: string;
  year: string;
  genre: string[];
  totalSeasons: number;
  type: "series";
  seasons: Season[];
}

interface User {
  _id: string;
  username: string;
}

interface SeriesListItem {
  seriesId: Series;
  episodeProgress: EpisodeProgress[];
}

interface SeriesCardProps {
  data: SeriesListItem;
  members: User[];
  currentUserId: string;
  onToggleEpisodeCompletion: (seriesId: string, seasonNumber: number, episodeNumber: number) => void;
}

export function SeriesCard({ 
  data, 
  members, 
  currentUserId, 
  onToggleEpisodeCompletion 
}: SeriesCardProps) {
  const { seriesId, episodeProgress } = data
  const [expandedSeasons, setExpandedSeasons] = useState<Set<number>>(new Set())
  const [isSeriesExpanded, setIsSeriesExpanded] = useState(false)

  // Get all episode progress for specific episode (all users)
  const getEpisodeProgressForAllUsers = (seasonNum: number, episodeNum: number) => {
    return episodeProgress.filter(
      ep => ep.seasonNumber === seasonNum && ep.episodeNumber === episodeNum
    )
  }

  // Get episode progress for specific episode and user
  const getEpisodeProgress = (seasonNum: number, episodeNum: number, userId: string) => {
    return episodeProgress.find(
      ep => ep.seasonNumber === seasonNum && 
           ep.episodeNumber === episodeNum &&
           ep.userId === userId
    )
  }

  // Check if episode is completed by current user
  const isEpisodeCompletedByUser = (seasonNum: number, episodeNum: number, userId: string) => {
    const progress = getEpisodeProgress(seasonNum, episodeNum, userId)
    return progress?.completed || false
  }

  // Check if current user completed the episode
  const isCurrentUserEpisodeCompleted = (seasonNum: number, episodeNum: number) => {
    return isEpisodeCompletedByUser(seasonNum, episodeNum, currentUserId)
  }

  // Check how many users completed an episode
  const getEpisodeCompletionCount = (seasonNum: number, episodeNum: number) => {
    const allProgress = getEpisodeProgressForAllUsers(seasonNum, episodeNum)
    return allProgress.filter(ep => ep.completed).length
  }

  // Check if season is completed by current user
  const isSeasonCompletedByUser = (seasonNum: number) => {
    const season = seriesId.seasons.find(s => s.seasonNumber === seasonNum)
    if (!season) return false
    
    return season.episodes.every(episode => 
      isEpisodeCompletedByUser(seasonNum, episode.episodeNumber, currentUserId)
    )
  }

  // Check if entire series is completed by current user
  const isSeriesCompletedByUser = () => {
    return seriesId.seasons.every(season => 
      season.episodes.every(episode => 
        isEpisodeCompletedByUser(season.seasonNumber, episode.episodeNumber, currentUserId)
      )
    )
  }

  // Get season completion count (how many users completed entire season)
  const getSeasonCompletionCount = (seasonNum: number) => {
    const season = seriesId.seasons.find(s => s.seasonNumber === seasonNum)
    if (!season) return 0
    
    return members.filter(member => 
      season.episodes.every(episode => 
        isEpisodeCompletedByUser(seasonNum, episode.episodeNumber, member._id)
      )
    ).length
  }

  // Get series completion count (how many users completed entire series)
  const getSeriesCompletionCount = () => {
    return members.filter(member => 
      seriesId.seasons.every(season => 
        season.episodes.every(episode => 
          isEpisodeCompletedByUser(season.seasonNumber, episode.episodeNumber, member._id)
        )
      )
    ).length
  }

  // Toggle season expansion
  const toggleSeason = (seasonNumber: number) => {
    const newExpanded = new Set(expandedSeasons)
    if (newExpanded.has(seasonNumber)) {
      newExpanded.delete(seasonNumber)
    } else {
      newExpanded.add(seasonNumber)
    }
    setExpandedSeasons(newExpanded)
  }

  // Handle episode completion toggle
  const handleEpisodeToggle = (seasonNumber: number, episodeNumber: number) => {
    onToggleEpisodeCompletion(seriesId._id, seasonNumber, episodeNumber)
  }

  // Calculate overall stats
  const totalEpisodes = seriesId.seasons.reduce((total, season) => total + season.episodes.length, 0)
  const seriesCompletionCount = getSeriesCompletionCount()
  const totalMembers = members.length

  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-200">
      <CardContent className="p-6">
        {/* Series Header */}
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <img
              src={seriesId.poster || "/placeholder.svg"}
              alt={seriesId.title}
              className="w-24 h-36 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Title and Completion Status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <h3 className="text-xl font-semibold text-white truncate">
                  {seriesId.title} ({seriesId.year})
                </h3>
                {isSeriesCompletedByUser() ? (
                  <Badge className="bg-green-600 text-white border-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-gray-500 text-gray-400"
                  >
                    <XCircle className="w-3 h-3 mr-1" />
                    In Progress
                  </Badge>
                )}
              </div>

              <button
                onClick={() => setIsSeriesExpanded(!isSeriesExpanded)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isSeriesExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* Series Info */}
            <div className="space-y-2 mb-4">
              <div className="flex flex-wrap gap-2">
                {seriesId.genre.map((g, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {g}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{totalEpisodes} episodes • {seriesId.totalSeasons} seasons</span>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{seriesCompletionCount}/{totalMembers} completed</span>
                </div>
              </div>
            </div>

            {/* Progress Bar - Users completed / Total users */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Series Completion</span>
                <span className="text-gray-300">
                  {totalMembers > 0 ? Math.round((seriesCompletionCount / totalMembers) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${totalMembers > 0 ? (seriesCompletionCount / totalMembers) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Seasons and Episodes */}
        {isSeriesExpanded && (
          <div className="mt-6 space-y-4">
            {seriesId.seasons.map((season) => {
              const seasonCompletionCount = getSeasonCompletionCount(season.seasonNumber)
              const isCurrentUserSeasonCompleted = isSeasonCompletedByUser(season.seasonNumber)
              
              return (
                <div key={season.seasonNumber} className="border border-gray-700 rounded-lg overflow-hidden">
                  {/* Season Header */}
                  <button
                    onClick={() => toggleSeason(season.seasonNumber)}
                    className="w-full px-4 py-3 bg-gray-750 hover:bg-gray-700 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-white">
                        Season {season.seasonNumber}
                      </span>
                      <span className="text-sm text-gray-400">
                        {season.episodes.length} episodes
                      </span>
                      {isCurrentUserSeasonCompleted && (
                        <Badge className="bg-green-600/80 text-white text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Users className="w-3 h-3" />
                        <span>{seasonCompletionCount}/{totalMembers}</span>
                      </div>
                      {expandedSeasons.has(season.seasonNumber) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Episodes List */}
                  {expandedSeasons.has(season.seasonNumber) && (
                    <div className="divide-y divide-gray-700">
                      {season.episodes.map((episode) => {
                        const currentUserProgress = getEpisodeProgress(season.seasonNumber, episode.episodeNumber, currentUserId)
                        const isCurrentUserCompleted = isCurrentUserEpisodeCompleted(season.seasonNumber, episode.episodeNumber)
                        const episodeCompletionCount = getEpisodeCompletionCount(season.seasonNumber, episode.episodeNumber)
                        
                        return (
                          <div key={episode.episodeNumber} className="p-4 bg-gray-800/30">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleEpisodeToggle(season.seasonNumber, episode.episodeNumber)}
                                  className="transition-all hover:scale-105"
                                >
                                  {isCurrentUserCompleted ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-gray-500 hover:text-green-500" />
                                  )}
                                </button>
                                <div>
                                  <span className="text-white font-medium">
                                    S{season.seasonNumber}E{episode.episodeNumber}
                                  </span>
                                  {episode.title && (
                                    <span className="text-gray-300 ml-2">{episode.title}</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Episode completion count */}
                                <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                                  <Users className="w-3 h-3" />
                                  <span>{episodeCompletionCount}/{totalMembers}</span>
                                </div>

                                {/* Reactions */}
                                {currentUserProgress?.reactions.map((reaction, i) => (
                                  <span key={i} className="text-lg">{reaction}</span>
                                ))}

                                {/* IMDB Rating */}
                                {episode.imdbRating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    <span className="text-xs text-gray-300">{episode.imdbRating}</span>
                                  </div>
                                )}

                                {/* Poll Rating */}
                                {currentUserProgress?.pollRating && (
                                  <div className="flex items-center gap-1 bg-blue-600/20 px-2 py-1 rounded">
                                    <Star className="w-3 h-3 text-blue-400 fill-current" />
                                    <span className="text-xs text-blue-300">{currentUserProgress.pollRating}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Episode Details */}
                            {episode.plot && (
                              <p className="text-sm text-gray-400 mb-2 line-clamp-2">{episode.plot}</p>
                            )}

                            {/* Comments Section */}
                            {currentUserProgress?.comments && currentUserProgress.comments.length > 0 && (
                              <div className="mt-3 relative">
                                <div className={`space-y-1 ${!isCurrentUserCompleted ? "blur-sm" : ""}`}>
                                  {currentUserProgress.comments.map((comment: Comment, commentIndex: number) => {
                                    const user = members.find((m) => m._id === comment.userId)
                                    return (
                                      <div key={commentIndex} className="text-xs text-gray-400 bg-gray-700/30 p-2 rounded">
                                        <span className="font-medium text-gray-300">{user?.username ?? "Unknown"}:</span>{" "}
                                        {comment.text}
                                      </div>
                                    )
                                  })}
                                </div>

                                {!isCurrentUserCompleted && (
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-gray-900/90 px-3 py-2 rounded-lg text-sm text-red-400 border border-red-500/30">
                                      🚫 Complete episode to view comments
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}