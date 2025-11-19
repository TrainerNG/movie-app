import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../services/movie';
import { MovieDetailsInterface } from '../../interfaces/movie-details';
import { CommonModule } from '@angular/common';
import { EncryptionService } from '../../services/encryption-service';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {
private route = inject(ActivatedRoute);
private router = inject(Router);
private movieService = inject(Movie);
private encryptionService = inject(EncryptionService);
private cdr = inject(ChangeDetectorRef);

movieDetails: MovieDetailsInterface | null = null;
loading = true;

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

loadMovieDetails(id: number){
this.loading=true;
this.movieService.getMovieDetails(id).subscribe({
  next:(movieDetails: MovieDetailsInterface) => {
   this.movieDetails = movieDetails;
   this.loading = false;
   this.cdr.markForCheck();
  }
})
}

goBack(){
  this.router.navigate(['/']);
}
}
