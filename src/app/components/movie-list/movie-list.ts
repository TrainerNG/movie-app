import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Movie } from '../../services/movie';
import { MovieSearchResponse } from '../../interfaces/movie-search-response';
import { FormsModule } from '@angular/forms';
import { MovieInterface } from '../../interfaces/movie';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EncryptionService } from '../../services/encryption-service';
import { ToastService } from '../../services/toast-service';
import { MovieCard } from "../movie-card/movie-card";

@Component({
  selector: 'app-movie-list',
  imports: [FormsModule, CommonModule, MovieCard, RouterLink],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {
private movieService = inject(Movie);
private cdr = inject(ChangeDetectorRef);
private encryptionService = inject(EncryptionService);
private toastrService = inject(ToastService);
private router = inject(Router);

query = '';
currentPage = 1;
movies:MovieInterface[]=[];
loading = false;
totalResults = 0;
error = false;

ngOnInit(){
  this.loadPopularMovies();
}

search(){
  if(this.query){
    this.currentPage = 1;
   this.loadMovies();
  }else{
    this.loadPopularMovies();
  }
}

loadMovies(){
  this.loading = true;
  this.movieService.searchMovies(this.query, this.currentPage).subscribe({
    next:(response: MovieSearchResponse)=>{
      this.movies = response.results || [];
      this.totalResults = response.total_results;
      this.toastrService.successMessage('Loaded Successfully');
      this.loading = false;
      this.cdr.markForCheck();
    }
  })
}

loadPopularMovies(){
  this.loading = true;
  this.movieService.getPopularMovies(this.currentPage).subscribe({
    next:(response: MovieSearchResponse) => {
      this.movies = response.results || [];
      this.totalResults = response.total_results;
      this.loading = false;
      this.toastrService.success('Loaded Successfully','Success',{timeOut:2000});
      this.cdr.markForCheck() // FORCEFULLY UPDATING UI.
    },
    error:(err)=>{
      console.error('loadPopularMovies error: ', err);
      this.loading = false;
      this.error = true;
      this.toastrService.error('Server Error','Error',{timeOut:4000});
      this.cdr.markForCheck();

    }
  })
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
