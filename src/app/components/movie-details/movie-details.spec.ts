import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MovieDetails } from './movie-details';
import { Movie } from '../../services/movie';
import { EncryptionService } from '../../services/encryption-service';
import { Loading } from '../../services/loading';
import { MovieDetailsInterface } from '../../interfaces/movie-details';

describe('MovieDetails', () => {
  let component: MovieDetails;
  let fixture: ComponentFixture<MovieDetails>;
  let mockActivatedRoute: any;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMovieService: jasmine.SpyObj<Movie>;
  let mockEncryptionService: jasmine.SpyObj<EncryptionService>;
  let mockLoadingService: any;

  const mockMovie: MovieDetailsInterface = {
    id: 1,
    title: 'Test Movie',
    overview: 'Test overview',
    poster_path: '/test.jpg',
    release_date: '2023-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    genres: [{ id: 1, name: 'Action' }],
    runtime: 120,
    tagline: 'Test tagline',
    backdrop_path: '/backdrop.jpg',
    imdb_id: 'tt1234567',
    budget: 1000000,
    homepage: 'https://example.com',
    status: 'Released',
    revenue: 5000000,
    popularity: 75.5,
    adult: false
  };

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('encrypted123')
        }
      }
    };

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockMovieService = jasmine.createSpyObj('Movie', ['getMovieDetails']);
    mockEncryptionService = jasmine.createSpyObj('EncryptionService', ['decrypt']);
    mockLoadingService = { isLoading$: of(false) };

    mockMovieService.getMovieDetails.and.returnValue(of(mockMovie));
    mockEncryptionService.decrypt.and.returnValue('1');

    await TestBed.configureTestingModule({
      imports: [MovieDetails],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: Movie, useValue: mockMovieService },
        { provide: EncryptionService, useValue: mockEncryptionService },
        { provide: Loading, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetails);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load movie details on init', async () => {
    fixture.detectChanges();
    await Promise.resolve();

    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('encryptedId');
    expect(mockEncryptionService.decrypt).toHaveBeenCalledWith('encrypted123');
    expect(mockMovieService.getMovieDetails).toHaveBeenCalledWith(1);
    expect(component.movieDetails()).toEqual(mockMovie);
  });

  it('should ignore invalid movie ID', () => {
    mockEncryptionService.decrypt.and.returnValue('invalid');

    fixture.detectChanges();

    expect(mockMovieService.getMovieDetails).not.toHaveBeenCalled();
    expect(component.movieDetails()).toBeNull();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should set movie details to null on service error', async () => {
    const errorResponse = { status: 404, message: 'Movie not found' };
    mockMovieService.getMovieDetails.and.returnValue(throwError(() => errorResponse));

    fixture.detectChanges();
    await Promise.resolve();

    expect(component.movieDetails()).toBeNull();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should expose loading observable from service', () => {
    expect(component.isLoading$).toBe(mockLoadingService.isLoading$);
  });

  it('should navigate back to movie list', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});