import { Routes } from '@angular/router';
import { MovieList } from './components/movie-list/movie-list';
import { MovieDetails } from './components/movie-details/movie-details';
import { AdvancedReactiveForm } from './components/advanced-reactive-form/advanced-reactive-form';
import { NonnullableReactiveForm } from './components/nonnullable-reactive-form/nonnullable-reactive-form';
import { ECommerce } from './e-commerce/e-commerce';
import { RxjsDemo } from './components/rxjs-demo/rxjs-demo';
import { SignalsDemoComponent } from './components/signals-demo/signals-demo';

export const routes: Routes = [
    {
        path: '', component: MovieList
    },
    {
        path:'movie/:encryptedId', component:MovieDetails
    },
    {
        path:'advanced-reactive-form', component:AdvancedReactiveForm
    },

     {
        path:'nonnullable-reactive-form', component:NonnullableReactiveForm
    },
    {
        path:'shop', component: ECommerce
    },
    {
        path:'rxjs-demo', component: RxjsDemo
    },
     {
        path:'signals-demo', component: SignalsDemoComponent
    }
];
