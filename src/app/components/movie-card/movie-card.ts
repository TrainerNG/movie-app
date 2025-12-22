import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieInterface } from '../../interfaces/movie';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCard {
@Input() movies: MovieInterface[] = [];
@Output() movieSelected = new EventEmitter<number>();

onMovieClick(movieId: number){
  this.movieSelected.emit(movieId);
}

trackByMovie = (_: number, movie: MovieInterface) => movie.id;
}
