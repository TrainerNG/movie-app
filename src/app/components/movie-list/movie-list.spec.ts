import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieList } from './movie-list';
import { Movie } from '../../services/movie';
import { EncryptionService } from '../../services/encryption-service';
import { Router } from '@angular/router';
import { Loading } from '../../services/loading';
import { of } from 'rxjs';
import { MovieSearchResponse } from '../../interfaces/movie-search-response';
import { MovieCard } from '../movie-card/movie-card';

describe('MovieList', () => {
  let component: MovieList;
  let fixture: ComponentFixture<MovieList>;
  let mockMovieService: jasmine.SpyObj<Movie>;
  let mockEncryptionService: jasmine.SpyObj<EncryptionService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLoadingService: jasmine.SpyObj<Loading>;

  const mockMovies = [
    {
      id: 1,
      title: 'Movie 1',
      overview: 'Overview 1',
      poster_path: '/path1.jpg',
      release_date: '2023-01-01',
      vote_average: 7.5,
      vote_count: 1000,
      adult: false,
      backdrop_path: '/backdrop1.jpg'
    },
    {
      id: 2,
      title: 'Movie 2',
      overview: 'Overview 2',
      poster_path: '/path2.jpg',
      release_date: '2023-02-01',
      vote_average: 8.0,
      vote_count: 2000,
      adult: false,
      backdrop_path: '/backdrop2.jpg'
    }
  ];

  beforeEach(async () => {
    mockMovieService = jasmine.createSpyObj('Movie', ['searchMovies', 'getPopularMovies']);
    mockEncryptionService = jasmine.createSpyObj('EncryptionService', ['encrypt']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLoadingService = jasmine.createSpyObj('Loading', [], { isLoading$: of(false) });

    await TestBed.configureTestingModule({
      imports: [MovieList, MovieCard],
      providers: [
        { provide: Movie, useValue: mockMovieService },
        { provide: EncryptionService, useValue: mockEncryptionService },
        { provide: Router, useValue: mockRouter },
        { provide: Loading, useValue: mockLoadingService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load popular movies on init', async () => {
    const mockResponse: MovieSearchResponse = {
      page: 1,
      results: mockMovies,
      total_pages: 1,
      total_results: 2
    };
    mockMovieService.getPopularMovies.and.returnValue(of(mockResponse));

    await component.ngOnInit();

    expect(mockMovieService.getPopularMovies).toHaveBeenCalledWith(1);
    expect(component.movies().length).toBe(2);
    expect(component.totalResults()).toBe(2);
  });

  it('should search movies when query is provided', async () => {
    const mockResponse: MovieSearchResponse = {
      page: 1,
      results: [mockMovies[0]],
      total_pages: 1,
      total_results: 1
    };
    mockMovieService.searchMovies.and.returnValue(of(mockResponse));

    component.query.set('test');
    await component.search();

    expect(mockMovieService.searchMovies).toHaveBeenCalledWith('test', 1);
    expect(component.movies().length).toBe(1);
    expect(component.totalResults()).toBe(1);
  });

  it('should load popular movies when search query is empty', async () => {
    const mockResponse: MovieSearchResponse = {
      page: 1,
      results: mockMovies,
      total_pages: 1,
      total_results: 2
    };
    mockMovieService.getPopularMovies.and.returnValue(of(mockResponse));

    component.query.set('   ');
    await component.search();

    expect(mockMovieService.getPopularMovies).toHaveBeenCalledWith(1);
    expect(component.movies().length).toBe(2);
  });

  it('should handle page change correctly', async () => {
    const mockResponse: MovieSearchResponse = {
      page: 2,
      results: [mockMovies[1]],
      total_pages: 2,
      total_results: 2
    };

    mockMovieService.searchMovies.and.returnValue(of(mockResponse));

    component.query.set('test');
    component.totalResults.set(40);
    await component.onPageChange(2);

    expect(component.currentPage()).toBe(2);
    expect(mockMovieService.searchMovies).toHaveBeenCalledWith('test', 2);
  });

  it('should not change page if page is invalid', async () => {
    component.currentPage.set(1);
    component.totalResults.set(40);
    await component.onPageChange(0); // Invalid page
    await component.onPageChange(100); // Page beyond total pages

    expect(component.currentPage()).toBe(1);
    expect(mockMovieService.searchMovies).not.toHaveBeenCalled();
  });

  it('should navigate to movie details on viewDetails', () => {
    const movieId = 123;
    const encryptedId = 'encrypted123';
    mockEncryptionService.encrypt.and.returnValue(encryptedId);
    
    component.viewDetails(movieId);
    
    expect(mockEncryptionService.encrypt).toHaveBeenCalledWith(movieId.toString());
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/movie', encryptedId]);
  });

  it('should calculate total pages correctly', () => {
    component.totalResults.set(45); // 45 results with 20 per page = 3 pages
    expect(component.totalPages()).toBe(3);
    
    component.totalResults.set(0);
    expect(component.totalPages()).toBe(0);
  });
});