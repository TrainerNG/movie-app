import { Routes } from '@angular/router';
import { MovieList } from './components/movie-list/movie-list';
import { MovieDetails } from './components/movie-details/movie-details';
import { AdvancedReactiveForm } from './components/advanced-reactive-form/advanced-reactive-form';
import { NonNullableReactiveForm } from './components/nonnullable-reactive-form/nonnullable-reactive-form';

export const routes: Routes = [
    {
        path: '', component: MovieList
    },
    {
        path:'movie/:encryptedId', component:MovieDetails
    },
    {
        path:'reactive-form-demo', component:AdvancedReactiveForm
    },
    {
        path:'nonnullable-form-demo', component:NonNullableReactiveForm
    }
];
