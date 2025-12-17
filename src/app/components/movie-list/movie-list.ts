import { Component, inject } from '@angular/core';
import { Movie } from '../../services/movie';
import { MovieSearchResponse } from '../../interfaces/movie-search-response';
import { FormsModule } from '@angular/forms';
import { MovieInterface } from '../../interfaces/movie';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EncryptionService } from '../../services/encryption-service';
import { ToastService } from '../../services/toast-service';
import { MovieCard } from "../movie-card/movie-card";
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-movie-list',
  imports: [FormsModule, CommonModule, MovieCard],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {
  private movieService = inject(Movie);
  loadingService = inject(LoadingService);
  private encryptionService = inject(EncryptionService);
  private toastrService = inject(ToastService);
  private router = inject(Router);

  query = '';
  currentPage = 1;
  movies:MovieInterface[]=[];
  totalResults = 0;
  error = false;

ngOnInit(){
  this.loadPopularMovies();
}

search() {
  if (this.query) {
    this.currentPage = 1;
    this.loadMovies();
  } else {
    this.loadPopularMovies();
  }
}

  loadMovies() {
    this.movieService.searchMovies(this.query, this.currentPage).subscribe({
      next: (response: MovieSearchResponse) => {
        this.movies = response.results || [];
        this.totalResults = response.total_results;
      },
      error: (err) => {
        console.error('loadMovies error: ', err);
        this.error = true;
      }
    });
  }

  loadPopularMovies() {
    this.movieService.getPopularMovies(this.currentPage).subscribe({
      next: (response: MovieSearchResponse) => {
        this.movies = response.results || [];
        this.totalResults = response.total_results;
      },
      error: (err) => {
        console.error('loadPopularMovies error: ', err);
        this.error = true;
      }
    });
  }

get totalPages(): number{
  return Math.ceil(this.totalResults / 20) ; // TMDB has 20 pages
}

onPageChange(page: number){
  this.currentPage = page;
  this.loadPopularMovies();
}

viewDetails(movieId: number){
  const encryptedId = this.encryptionService.encrypt(movieId.toString());
this.router.navigate(['/movie',encryptedId]);
}
}
