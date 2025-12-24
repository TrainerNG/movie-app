import {Component, computed, inject, signal } from '@angular/core';
import { Movie } from '../../services/movie';
import { MovieSearchResponse } from '../../interfaces/movie-search-response';
import { FormsModule } from '@angular/forms';
import { MovieInterface } from '../../interfaces/movie';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EncryptionService } from '../../services/encryption-service';
import { MovieCard } from "../movie-card/movie-card";
import { Loading } from '../../services/loading';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-movie-list',
  imports: [FormsModule, CommonModule, MovieCard],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList {
  private movieService = inject(Movie);
  private encryptionService = inject(EncryptionService);
  loadingService = inject(Loading);
  private router = inject(Router);

  readonly query = signal('');
  readonly currentPage = signal(1);
  readonly movies = signal<MovieInterface[]>([]);
  readonly totalResults = signal(0);

  readonly isLoading$ = this.loadingService.isLoading$;

  ngOnInit() {
    this.loadPopularMovies();
  }

  search() {
    if (this.query().trim()) {
      this.currentPage.set(1);
      this.loadMovies();
    } else {
      this.loadPopularMovies();
    }
  }

  async loadMovies() {
    await this.resolveRequest(this.movieService.searchMovies(this.query().trim(), this.currentPage()));
  }

  async loadPopularMovies() {
    await this.resolveRequest(this.movieService.getPopularMovies(this.currentPage()))
  }

  private async resolveRequest(request: Observable<MovieSearchResponse>) {
    try {
      const response = await firstValueFrom(request);
      this.movies.set(response.results ?? []);
      this.totalResults.set(response.total_results ?? 0);
    } catch (err) {
      this.movies.set([]);
      this.totalResults.set(0);
    }
  }

  readonly totalPages = computed(() => {
    const results = this.totalResults();
    return results >= 0 ? Math.ceil(results / 20) : 0
  })

  onPageChange(page: number) {
    if (page < 1 || (this.totalPages() && page > this.totalPages())) {
      return;
    }
    this.currentPage.set(page);
    if (this.query().trim()) {
      this.loadMovies();
    }
    else {
      this.loadPopularMovies();
    }
  }

  viewDetails(movieId: number) {
    const encryptedId = this.encryptionService.encrypt(movieId.toString());
    this.router.navigate(['/movie', encryptedId]);
  }
}
