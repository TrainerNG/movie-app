import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MovieInterface } from '../../interfaces/movie';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
@Input() movies: MovieInterface[] = [];
@Output() movieSelected = new EventEmitter<number>();

onMovieClick(movieId: number){
  this.movieSelected.emit(movieId);
}
}
