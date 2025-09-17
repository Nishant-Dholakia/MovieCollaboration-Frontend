import React, { useEffect, useState } from "react";
import { Film, TrendingUp, Star, Clock } from "lucide-react";
import api from "../api/axios";
import type { Movie , Rating} from "../types/movie";
// import WeaponsMovieCard from "../components/WeaponsMovieCard";



const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const cachedMovies = localStorage.getItem("trendingMovies");
		if (cachedMovies) {
			setMovies(JSON.parse(cachedMovies));
			setLoading(false);
			return; // don’t call backend again
		}
			// Replace this with your actual API call
			console.log("Calling backend...");
			console.log(movies);
			const res = await api.get("/movie/trending");
			// if (res.status === 200 && res.data && res.data.results) {
			setMovies(res.data);
			localStorage.setItem("trendingMovies", JSON.stringify(res.data)); 

		}
        
       catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load trending movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
	console.log("Movies fetched:", movies);

  }, []);

  const formatRating = (rating: number): string => {
    return rating.toFixed(1);
  };

  const formatReleaseYear = (releaseDate: string): string => {
    return new Date(releaseDate).getFullYear().toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading trending movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center p-8">
          <Film className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-black/40"></div>
        <div className="relative z-10 pt-8 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <TrendingUp className="w-8 h-8 text-red-500" />
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Trending Movies
              </h1>
            </div>
            <p className="text-gray-300 text-lg max-w-2xl">
              Discover the most popular movies right now. From spine-chilling horrors to heart-pounding thrillers.
            </p>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {movies.length === 0 ? (
            <div className="text-center py-12">
              <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No trending movies found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {movies.map((movie) => (
                <div
                  key={movie.imdbID}
                  className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl hover:shadow-red-900/20 transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                >
                  {/* Movie Poster */}
                  <div className="relative h-96 overflow-hidden">
                    <img
                      src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : '/api/placeholder/300/450'}
                      alt={movie.Title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold text-sm">
                        {formatRating(Number(movie.imdbRating))}
                      </span>
                    </div>

                    {/* Rated Badge */}
                    {movie.Rated && movie.Rated !== "N/A" && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                        {movie.Rated}
                      </div>
                    )}
                  </div>

                  {/* Movie Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors duration-200 line-clamp-2">
                        {movie.Title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm ml-3">
                        <Clock className="w-4 h-4" />
                        <span>{formatReleaseYear(movie.Released)}</span>
                      </div>
                    </div>
                    
                    {/* Genre */}
                    <p className="text-red-400 font-medium text-sm mb-2">
                      {movie.Genre}
                    </p>
                    
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">
                      {movie.Plot}
                    </p>
                    
                    {/* Additional Info */}
                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                      <span>{movie.Runtime}</span>
                      <span>{movie.imdbVotes} votes</span>
                    </div>
                    
                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2">
                      <Film className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;