

// =====================
// User
// =====================
export interface Contact {
  countryCode?: string; // like +91
  number?: string;      // 6–15 digits
}

export interface User {
  _id: string;
  username: string;
  email: string;
  displayName?: string;
  contact?: Contact;
  avatar?: string;
  groups: string[];      // references Group._id[]
  createdAt?: string;
  updatedAt?: string;
}

// export type GroupMember = Pick<User, '_id' | 'username' | 'displayName' | 'avatar'>;


// =====================
// Group
// =====================
export interface Group {
  _id: string;
  name: string;
  description?: string;
  members: User[]; // populated or just ids
  admins: string[];
  watchlist?: Watchlist | string;
  createdAt?: string;
  updatedAt?: string;
}

// =====================
// Comment
// =====================
export interface Comment {
  userId: string;
  text: string;
  timestamp: string;
}

// =====================
// Movie
// =====================
export interface Movie {
  _id: string;
  omdbId: string;
  title: string;
  year: string;            // could be "2010–2015"
  genre: string[];
  poster?: string;
  runtime: string;
  type: "movie";
  createdAt?: string;
  updatedAt?: string;
}

// =====================
// Series, Seasons, Episodes
// =====================

// Episode details from backend
export interface Episode {
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

// Season with list of episodes
export interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

// Full series
export interface Series {
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



// =====================
// Progress Tracking
// =====================
export interface UserMovieProgress {
  userId: User | string;
  completed: boolean;
  reactions: Array<'🔥' | '😂' | '❤️' | '😢' | '😡'>;
  pollRating?: number;
}


// Episode progress per user
export interface EpisodeProgress {
  seasonNumber: number;
  episodeNumber: number;
  userId: string;
  completed: boolean;
  reactions: Array<'🔥' | '😂' | '❤️' | '😢' | '😡'>;
  pollRating?: number;
  comments: Comment[];
}
// =====================
// Watchlist
// =====================
export interface MovieListItem {
  movieId: Movie;
  userProgress: UserMovieProgress[];
  comments: Comment[];
}
// Series list wrapper (backend sends series + progress info for current user/team)
export interface SeriesListItem {
  seriesId: Series;              // populated Series object
  episodeProgress: EpisodeProgress[];
}



export interface Watchlist {
  _id: string;
  groupId: Group | string;
  movieList: MovieListItem[];
  seriesList: SeriesListItem[];
  createdAt: string;
  updatedAt: string;
}
