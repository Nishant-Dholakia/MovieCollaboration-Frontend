import { Star, Calendar, Clock, Trophy, DollarSign } from 'lucide-react';
import type { Movie, Rating } from '../types/movie';

export default function WeaponsMovieCard({movieData} : {movieData: Movie}) {
  

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-900/20 transition-all duration-300 hover:scale-[1.02]">
        
        {/* Header with gradient overlay */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-black/60 z-10"></div>
          <div className="relative z-20 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight">{movieData.Title}</h1>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {movieData.Rated}
              </span>
            </div>
            <p className="text-red-400 font-medium text-lg">{movieData.Genre}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 p-6">
          
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={movieData.Poster}
                alt={`${movieData.Title} poster`}
                className="w-72 h-auto rounded-xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="flex-1 space-y-6">
            
            {/* Plot */}
            <div>
              <h3 className="text-xl font-semibold text-red-400 mb-3">Plot</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {movieData.Plot}
              </p>
            </div>

            {/* Movie Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5 text-red-400" />
                <span><strong>Released:</strong> {movieData.Released}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-red-400" />
                <span><strong>Runtime:</strong> {movieData.Runtime}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Trophy className="w-5 h-5 text-red-400" />
                <span><strong>Awards:</strong> {movieData.Awards}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <DollarSign className="w-5 h-5 text-red-400" />
                <span><strong>Box Office:</strong> {movieData.BoxOffice}</span>
              </div>
            </div>

            {/* Cast & Crew */}
            <div className="space-y-3">
              <div>
                <span className="text-red-400 font-semibold">Director: </span>
                <span className="text-gray-300">{movieData.Director}</span>
              </div>
              <div>
                <span className="text-red-400 font-semibold">Writer: </span>
                <span className="text-gray-300">{movieData.Writer}</span>
              </div>
              <div>
                <span className="text-red-400 font-semibold">Starring: </span>
                <span className="text-gray-300">{movieData.Actors}</span>
              </div>
            </div>

            {/* Ratings */}
            <div>
              <h3 className="text-xl font-semibold text-red-400 mb-4">Ratings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {movieData.Ratings.map((rating: Rating, index: number) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center hover:bg-gray-800/70 transition-colors duration-200">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold text-white">
                        {rating.Value}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">
                      {rating.Source === "Internet Movie Database" ? "IMDb" : 
                       rating.Source === "Rotten Tomatoes" ? "Rotten Tomatoes" : 
                       "Metacritic"}
                    </p>
                    {rating.Source === "Internet Movie Database" && (
                      <p className="text-gray-500 text-xs mt-1">
                        {movieData.imdbVotes} votes
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}