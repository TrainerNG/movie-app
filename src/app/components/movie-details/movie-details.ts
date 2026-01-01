import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../services/movie';
import { MovieDetailsInterface } from '../../interfaces/movie-details';
import { CommonModule } from '@angular/common';
import { EncryptionService } from '../../services/encryption-service';
import { Loading } from '../../services/loading';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDetails {
private route = inject(ActivatedRoute);
private router = inject(Router);
private movieService = inject(Movie);
private encryptionService = inject(EncryptionService);
loadingService = inject(Loading);


readonly movieDetails = signal<MovieDetailsInterface | null>(null);
readonly isLoading$ = this.loadingService.isLoading$;

ngOnInit(){
  const idParam = this.route.snapshot.paramMap.get('encryptedId');
  if(idParam){
    const decryptedId = this.encryptionService.decrypt(idParam);
    const id = +decryptedId;
    if(id > 0){
      this.loadMovieDetails(id);
    }
  }
}

async loadMovieDetails(id: number){
try{
const details = await firstValueFrom(this.movieService.getMovieDetails(id));
this.movieDetails.set(details);
}catch(err){
  this.movieDetails.set(null);
}
}

goBack(){
  this.router.navigate(['/']);
}
}
