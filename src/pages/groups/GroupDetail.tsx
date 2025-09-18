"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupHeader } from "./components/group-header"
import { MembersSidebar } from "./components/members-sidebar"
import { MovieCard } from "./components/movie-card"
import { SeriesCard } from "./components/series-card"

// Mock data - replace with actual API calls
const mockGroupData = {
  id: "1",
  name: "Avengers Squad",
  description: "Group of Marvel fans binge-watching all MCU movies",
  members: [
    { id: "1", name: "Tony Stark", avatar: "/tony-stark.jpg", isAdmin: true },
    { id: "2", name: "Steve Rogers", avatar: "/steve-rogers.jpg", isAdmin: true },
    { id: "3", name: "Natasha Romanoff", avatar: "/natasha-romanoff.jpg", isAdmin: false },
    { id: "4", name: "Bruce Banner", avatar: "/bruce-banner.jpg", isAdmin: false },
    { id: "5", name: "Thor Odinson", avatar: "/mighty-god-of-thunder.png", isAdmin: false },
  ],
  watchlist: {
    movieList: [
      {
        movieId: {
          id: "1",
          title: "Iron Man",
          year: 2008,
          poster: "/iron-man-movie-poster.jpg",
        },
        userProgress: [
          { userId: "1", completed: true, reactions: ["🔥", "❤️"], pollRating: 5 },
          { userId: "2", completed: true, reactions: ["🔥"], pollRating: 4 },
          { userId: "3", completed: true, reactions: ["❤️"], pollRating: 5 },
          { userId: "4", completed: false, reactions: [], pollRating: null },
          { userId: "5", completed: false, reactions: [], pollRating: null },
        ],
        comments: [
          { userId: "1", text: "This started it all! Amazing origin story.", timestamp: new Date("2024-01-15") },
          { userId: "3", text: "RDJ was perfect casting for Tony Stark", timestamp: new Date("2024-01-16") },
        ],
      },
      {
        movieId: {
          id: "2",
          title: "The Avengers",
          year: 2012,
          poster: "/generic-superhero-team-poster.png",
        },
        userProgress: [
          { userId: "1", completed: true, reactions: ["🔥", "🔥"], pollRating: 5 },
          { userId: "2", completed: true, reactions: ["🔥"], pollRating: 5 },
          { userId: "3", completed: false, reactions: [], pollRating: null },
          { userId: "4", completed: false, reactions: [], pollRating: null },
          { userId: "5", completed: false, reactions: [], pollRating: null },
        ],
        comments: [{ userId: "1", text: "The team finally comes together!", timestamp: new Date("2024-01-20") }],
      },
    ],
    seriesList: [
      {
        seriesId: {
          id: "1",
          title: "Loki",
          year: 2021,
          poster: "/loki-series-poster.jpg",
        },
        episodeProgress: [
          {
            seasonNumber: 1,
            episodeNumber: 1,
            userId: "1",
            completed: true,
            reactions: ["🔥"],
            pollRating: 4,
            comments: [{ userId: "1", text: "Great start to the series!", timestamp: new Date("2024-01-10") }],
          },
        ],
      },
    ],
  },
}

export default function GroupDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("movies")
  const [userCompletionStatus, setUserCompletionStatus] = useState<{ [key: string]: boolean }>({})

  const group = mockGroupData // Replace with actual API call using params.id
  const currentUserId = "1" // Replace with actual current user ID from auth

  const toggleCompletionStatus = (itemId: string, itemType: "movie" | "series") => {
    const currentStatus = getUserCompletionStatus(itemId, itemType)
    setUserCompletionStatus((prev) => ({
      ...prev,
      [`${itemType}-${itemId}`]: !currentStatus,
    }))

    // TODO: Make API call to update completion status in backend
    console.log(`[v0] Toggling ${itemType} ${itemId} completion status to:`, !currentStatus)
  }

  const getUserCompletionStatus = (itemId: string, itemType: "movie" | "series") => {
    const stateKey = `${itemType}-${itemId}`
    if (stateKey in userCompletionStatus) {
      return userCompletionStatus[stateKey]
    }

    // Fallback to original data
    if (itemType === "movie") {
      const movie = group.watchlist.movieList.find((m) => m.movieId.id === itemId)
      const currentUserProgress = movie?.userProgress.find((up) => up.userId === currentUserId)
      return currentUserProgress?.completed || false
    } else {
      const series = group.watchlist.seriesList.find((s) => s.seriesId.id === itemId)
      const userEpisodeProgress = series?.episodeProgress.find((ep) => ep.userId === currentUserId)
      return userEpisodeProgress?.completed || false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <GroupHeader groupName={group.name} groupDescription={group.description} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700">
                <TabsTrigger value="movies" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Movies ({group.watchlist.movieList.length})
                </TabsTrigger>
                <TabsTrigger value="series" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Series ({group.watchlist.seriesList.length})
                </TabsTrigger>
              </TabsList>

              {/* Movies Tab */}
              <TabsContent value="movies" className="space-y-6 mt-6">
                {group.watchlist.movieList.map((movie) => {
                  const userCompleted = getUserCompletionStatus(movie.movieId.id, "movie")
                  return (
                    <MovieCard
                      key={movie.movieId.id}
                      movie={movie}
                      members={group.members}
                      currentUserId={currentUserId}
                      userCompleted={userCompleted}
                      onToggleCompletion={(movieId : string) => toggleCompletionStatus(movieId, "movie")}
                    />
                  )
                })}
              </TabsContent>

              {/* Series Tab */}
              <TabsContent value="series" className="space-y-6 mt-6">
                {group.watchlist.seriesList.map((series) => {
                  const userCompleted = getUserCompletionStatus(series.seriesId.id, "series")
                  return (
                    <SeriesCard
                      key={series.seriesId.id}
                      series={series}
                      members={group.members}
                      currentUserId={currentUserId}
                      userCompleted={userCompleted}
                      onToggleCompletion={(seriesId : string) => toggleCompletionStatus(seriesId, "series")}
                    />
                  )
                })}
              </TabsContent>
            </Tabs>
          </div>

          {/* Members Sidebar */}
          <div className="lg:col-span-1">
            <MembersSidebar members={group.members} />
          </div>
        </div>
      </div>
    </div>
  )
}
