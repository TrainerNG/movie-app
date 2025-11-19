import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieSearchResponse } from '../interfaces/movie-search-response';
import { MovieDetailsInterface } from '../interfaces/movie-details';

@Injectable({
  providedIn: 'root',
})
export class Movie {
  private baseUrl = 'https://api.themoviedb.org/3';

  // NOT RECOMMENDED

  constructor(private http: HttpClient){}


  searchMovies(query: string,page: number = 1): Observable<MovieSearchResponse>{
    const params = new HttpParams()
    .set('query', query)
    .set('page', page)
    return this.http.get<MovieSearchResponse>(`${this.baseUrl}/search/movie`,{params});

  }


  // GET: Get popular movies (for initial load)

  getPopularMovies(page: number = 1) : Observable<MovieSearchResponse>{
    const params = new HttpParams()
    .set('page',page);
    return this.http.get<MovieSearchResponse>(`${this.baseUrl}/movie/popular`,{params});
  }

  // GET: Get movie details by ID

  getMovieDetails(id: number) : Observable<MovieDetailsInterface>{
    return this.http.get<MovieDetailsInterface>(`${this.baseUrl}/movie/${id}`);
  }
}
