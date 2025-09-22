"use client"

import { useState, useEffect, useContext } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupHeader } from "./components/GroupHeader"
import { MembersSidebar } from "./components/MembersSidebar"
import { MovieCard } from "./components/MovieCard"
import { SeriesCard } from "./components/SeriesCard"
import api from "@/api/axios"
import type { Group, MovieListItem, SeriesListItem, User } from  "@/interfaces/interfaces"
import { AuthContext } from "@/context/AuthContext"

// Props type
interface GroupDetailsPageProps {
  params: {
    id: string
  }
}

const GroupDetailsPage: React.FC<GroupDetailsPageProps> = ({ params }) => {
  const [activeTab, setActiveTab] = useState("movies")
  const [userCompletionStatus, setUserCompletionStatus] = useState<{ [key: string]: boolean }>({})
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const user = useContext(AuthContext)?.user;
  const currentUserId = user?.id || '';

  // Fetch group on mount
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        console.log("Params ",params);
        const res = await api.get("/groups/group", { params: { id: params.id } })
        setGroup(res.data.data) // because you return { success, message, data }
      } catch (err) {
        console.error("Failed to fetch group", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGroup()
  }, [params.id])

  const toggleCompletionStatus = (itemId: string, itemType: "movie" | "series") => {
    const currentStatus = getUserCompletionStatus(itemId, itemType)
    setUserCompletionStatus((prev) => ({
      ...prev,
      [`${itemType}-${itemId}`]: !currentStatus,
    }))

    // TODO: API call to backend to update progress
    console.log(`[v0] Toggling ${itemType} ${itemId} completion status to:`, !currentStatus)
  }

  const getUserCompletionStatus = (itemId: string, itemType: "movie" | "series") => {
    const stateKey = `${itemType}-${itemId}`
    if (stateKey in userCompletionStatus) {
      return userCompletionStatus[stateKey]
    }

    if (!group) return false

    // fallback to original data
    if (itemType === "movie") {
      const movie = typeof group.watchlist === "object" && group.watchlist?.movieList.find((m: any) => m.movieId._id === itemId || m.movieId.id === itemId)
      if (movie && typeof movie !== "boolean" && movie.userProgress) {
        const currentUserProgress = movie.userProgress.find((up: any) => up.userId === currentUserId)
        return currentUserProgress?.completed || false
      }
      return false
    } else {
      const series = typeof group.watchlist === "object" && group.watchlist?.seriesList.find((s: any) => s.seriesId._id === itemId || s.seriesId.id === itemId)
      const userEpisodeProgress = typeof series === "object" && series?.episodeProgress.find((ep: any) => ep.userId === currentUserId)
      if (userEpisodeProgress && typeof userEpisodeProgress === "object") {
        return userEpisodeProgress.completed || false
      }
      return false
    }
  }

  if (loading) return <div className="text-white">Loading...</div>
  if (!group) return <div className="text-red-500">Group not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <GroupHeader groupId={group._id} groupName={group.name ?? ""} groupDescription={group.description ?? ""} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700">
                <TabsTrigger value="movies" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Movies ({typeof group.watchlist === "object" && group.watchlist?.movieList ? group.watchlist.movieList.length : 0})
                </TabsTrigger>
                <TabsTrigger value="series" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Series ({typeof group.watchlist === "object" && group.watchlist?.seriesList ? group.watchlist.seriesList.length : 0})
                </TabsTrigger>
              </TabsList>

              {/* Movies Tab */}
              <TabsContent value="movies" className="space-y-6 mt-6">
                {typeof group.watchlist === "object" && group.watchlist?.movieList.map((movie: MovieListItem) => {
                  const userCompleted = getUserCompletionStatus(movie.movieId._id || movie.movieId._id, "movie")
                  return (
                    <MovieCard
                      key={movie.movieId._id}
                      movie={movie}
                      members={group.members}
                      currentUserId={currentUserId}
                      userCompleted={userCompleted}
                      onToggleCompletion={(movieId: string) => toggleCompletionStatus(movieId, "movie")}
                    />
                  )
                })}
              </TabsContent>

              {/* Series Tab */}
              <TabsContent value="series" className="space-y-6 mt-6">
                {typeof group.watchlist === "object" && group.watchlist?.seriesList.map((series: SeriesListItem) => {
                  const userCompleted = getUserCompletionStatus(series.seriesId._id || series.seriesId._id, "series")
                  return (
                    <SeriesCard
                      key={series.seriesId._id}
                      series={series}
                      members={group.members}
                      currentUserId={currentUserId}
                      userCompleted={userCompleted}
                      onToggleCompletion={(seriesId: string) => toggleCompletionStatus(seriesId, "series")}
                    />
                  )
                })}
              </TabsContent>
            </Tabs>
          </div>

          {/* Members Sidebar */}
          <div className="lg:col-span-1">
            <MembersSidebar members={group.members.map((user: User) => ({
              id: user._id,
              name: user.username,
              avatar: user.avatar || "", 
              isAdmin: group.admins.includes(user._id),
            }))} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupDetailsPage
