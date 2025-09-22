export interface AddToWatchlistRequest {
  groupIds: string[]
  movieOrSeries: {
    id: string
    title: string
    year: string
    poster: string
    type: "movie" | "series"
    plot?: string
    genre?: string
    director?: string
    actors?: string
    runtime?: string
    imdbRating?: string
    imdbID: string
  }
}

export interface AddToWatchlistResponse {
  success: boolean
  message: string
  results: {
    groupId: string
    success: boolean
    message: string
  }[]
}

export interface UserGroupsResponse {
  groups: {
    id: string
    name: string
    description: string
    role: "admin" | "member"
  }[]
}

export interface OMDBSearchResult {
  imdbID: string
  Title: string
  Year: string
  Type: "movie" | "series"
  Poster: string
}

export interface OMDBSearchResponse {
  Search: OMDBSearchResult[]
  totalResults: string
  Response: "True" | "False"
  Error?: string
}

export interface OMDBMovieDetails {
  imdbID: string
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: Array<{
    Source: string
    Value: string
  }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  Type: "movie" | "series"
  DVD?: string
  BoxOffice?: string
  Production?: string
  Website?: string
  Response: "True" | "False"
  Error?: string
}
