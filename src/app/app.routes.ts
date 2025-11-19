import { Routes } from '@angular/router';
import { MovieList } from './components/movie-list/movie-list';
import { MovieDetails } from './components/movie-details/movie-details';

export const routes: Routes = [
    {
        path: '', component: MovieList
    },
    {
        path:'movie/:encryptedId', component:MovieDetails
    }
];
