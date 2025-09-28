"use client"

import { useState, useEffect, useContext } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupHeader } from "./components/GroupHeader"
import { MembersSidebar } from "./components/MembersSidebar"
import { MovieCard } from "./components/MovieCard"
import { SeriesCard } from "./components/SeriesCard"
import api from "@/api/axios"
import type { EpisodeProgress, Group, MovieListItem, SeriesListItem, User, UserMovieProgress, Watchlist } from "@/interfaces/interfaces"
import { AuthContext } from "@/context/AuthContext"

interface GroupDetailsPageProps {
  params: {
    id: string
  }
}

const GroupDetailsPage: React.FC<GroupDetailsPageProps> = ({ params }) => {
  const [activeTab, setActiveTab] = useState("movies")
  const [userCompletionStatus, setUserCompletionStatus] = useState<Record<string, boolean>>({})
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)

  const user = useContext(AuthContext)?.user;
  // console.log('AuthContext user:', user);
  const currentUserId = user?.id || "";

  // Type guard to check if watchlist is an object
  const isWatchlistObject = (watchlist: string | Watchlist | undefined): watchlist is Watchlist => {
    return typeof watchlist === "object" && watchlist !== null
  }

  // Fetch group on mount
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await api.get("/groups/group", { params: { id: params.id } })
        if (res.data?.data) {
          console.log('Fetched group data:', res.data.data);
          setGroup(res.data.data)
        } else {
          setGroup(null)
        }
      } catch (err) {
        console.error("Failed to fetch group", err)
        setGroup(null)
      } finally {
        setLoading(false)
      }
    }
    fetchGroup()
  }, [params.id])

  // Get completion status
  const getUserCompletionStatus = (itemId: string, itemType: "movie" | "series"): boolean => {
    const stateKey = `${itemType}-${itemId}`
    if (userCompletionStatus[stateKey] !== undefined) {
      return userCompletionStatus[stateKey]
    }

    if (!group?.watchlist || !isWatchlistObject(group.watchlist)) return false

    if (itemType === "movie") {
      const movie = group.watchlist.movieList?.find((m: MovieListItem) => m.movieId?._id === itemId)
      const progress = movie?.userProgress?.find((up: UserMovieProgress) => up.userId === currentUserId)
      return progress?.completed ?? false
    }

    if (itemType === "series") {
      const series = group.watchlist.seriesList?.find((s: SeriesListItem) => s.seriesId?._id === itemId)
      const epProgress = series?.episodeProgress?.find((ep: EpisodeProgress) => ep.userId === currentUserId)
      return epProgress?.completed ?? false
    }

    return false
  }

  // Movie completion toggle
  const toggleCompletionStatus = async (itemId: string, itemType: "movie" | "series") => {
    console.log('Movie toggle called:', { itemId, itemType, currentUserId })
    
    if (!group?.watchlist || !isWatchlistObject(group.watchlist)) {
      console.log('No watchlist or not object type in movie toggle')
      return
    }

    const currentStatus = getUserCompletionStatus(itemId, itemType)
    const newStatus = !currentStatus
    
    console.log('Current status:', currentStatus, 'New status:', newStatus)

    try {
      // First make the API call
      const response = await api.post("/progress/update", {
        groupId: group?._id,
        itemId,
        itemType,
        userId: currentUserId,
        completed: newStatus
      })
      
      console.log('Movie API response:', response.data)

      if (!response.data?.success) {
        throw new Error("Failed to update movie progress")
      }

      // Update local state cache for faster UI response
      setUserCompletionStatus((prev) => ({ ...prev, [`${itemType}-${itemId}`]: newStatus }))

      // Also update the group state AFTER successful API call
      setGroup((prev) => {
        if (!prev?.watchlist || !isWatchlistObject(prev.watchlist)) return prev
        const updated: Group = { ...prev }

        if (!updated.watchlist || !isWatchlistObject(updated.watchlist)) {
          return updated
        }

        if (itemType === "movie") {
          updated.watchlist = {
            ...updated.watchlist,
            movieList: updated.watchlist.movieList?.map((m) => {
              if (m.movieId?._id === itemId) {
                const existing = m.userProgress?.find((up) => up.userId === currentUserId)
                if (existing) {
                  existing.completed = newStatus
                  console.log('Updated existing movie progress:', existing)
                } else {
                  m.userProgress.push({ userId: currentUserId, completed: newStatus, reactions: [] })
                  console.log('Added new movie progress')
                }
              }
              return m
            }) || []
          }
        }

        return updated
      })

    } catch (err) {
      console.error("Failed to update progress", err)
      // No rollback needed since we didn't update state optimistically
    }
  }

  // Episode completion toggle
const onToggleEpisodeCompletion = async (seriesId: string, seasonNumber: number, episodeNumber: number) => {
  if (!group?.watchlist || !isWatchlistObject(group.watchlist)) return;

  const series = group.watchlist.seriesList?.find(s => s.seriesId?._id === seriesId);
  if (!series) return;

  const currentProgress = series.episodeProgress?.find(
    ep => ep.seasonNumber === seasonNumber && ep.episodeNumber === episodeNumber && ep.userId === currentUserId
  );
  const newStatus = !(currentProgress?.completed ?? false);

  try {
    const res = await api.post("/progress/episode-toggle", {
      seriesId,
      seasonNumber,
      episodeNumber,
      userId: currentUserId,
      completed: newStatus,
      groupId: group._id
    }); 
    console.log('Episode toggle API response:', res.data);
    if (!res.data.success) throw new Error("Failed");

    // Update frontend state
    setGroup(prev => {
          if (!prev || !prev.watchlist || !isWatchlistObject(prev.watchlist)) return prev;
    
          const updated: Group = { ...prev };
          if (!updated.watchlist || !isWatchlistObject(updated.watchlist)) {
            console.log('No watchlist or not object type in movie toggle');
            return prev;
          }
          updated.watchlist.seriesList = updated.watchlist.seriesList?.map(s => {
            if (s.seriesId?._id === seriesId) {
              const epProg = [...(s.episodeProgress || [])];
              const idx = epProg.findIndex(
                ep => ep.seasonNumber === seasonNumber && ep.episodeNumber === episodeNumber && ep.userId === currentUserId
              );
    
              if (idx >= 0) {
                epProg[idx] = { ...epProg[idx], completed: newStatus };
              } else {
                epProg.push({
                  seasonNumber,
                  episodeNumber,
                  userId: currentUserId,
                  completed: newStatus,
                  reactions: [],
                  comments: []
                });
              }
    
              return { ...s, episodeProgress: epProg };
            }
            return s;
          }) || [];
    
          return updated;
        });
  } catch (err) {
    console.error(err);
  }
};


  if (loading) return <div className="text-white">Loading...</div>
  if (!group) return <div className="text-red-500">Group not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <GroupHeader
        groupId={group._id}
        groupName={group.name ?? ""}
        groupDescription={group.description ?? ""}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-gray-700">
                <TabsTrigger value="movies" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Movies ({isWatchlistObject(group.watchlist) ? group.watchlist.movieList?.length ?? 0 : 0})
                </TabsTrigger>
                <TabsTrigger value="series" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Series ({isWatchlistObject(group.watchlist) ? group.watchlist.seriesList?.length ?? 0 : 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="movies" className="space-y-6 mt-6">
                {isWatchlistObject(group.watchlist) && group.watchlist.movieList?.map((movie) => {
                  const userCompleted = getUserCompletionStatus(movie.movieId?._id ?? "", "movie")
                  return (
                    <MovieCard
                      key={movie.movieId?._id}
                      movie={movie}
                      members={group.members || []}
                      currentUserId={currentUserId}
                      userCompleted={userCompleted}
                      onToggleCompletion={(movieId: string) => toggleCompletionStatus(movieId, "movie")}
                    />
                  )
                })}
              </TabsContent>

              <TabsContent value="series" className="space-y-6 mt-6">
                {isWatchlistObject(group.watchlist) && group.watchlist.seriesList?.map((series) => (
                  <SeriesCard
                    key={series.seriesId?._id}
                    data={series}
                    members={group.members || []}
                    currentUserId={currentUserId}
                    onToggleEpisodeCompletion={onToggleEpisodeCompletion}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Members Sidebar */}
          <div className="lg:col-span-1">
            <MembersSidebar
              members={(group.members || []).map((u: User) => ({
                id: u._id,
                name: u.username,
                avatar: u.avatar || "",
                isAdmin: group.admins?.includes(u._id) ?? false
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupDetailsPage