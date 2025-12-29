import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Movie } from './movie';
import { MovieSearchResponse } from '../interfaces/movie-search-response';
import { MovieDetailsInterface } from '../interfaces/movie-details';

describe('MovieService', () => {
  let service: Movie;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://api.themoviedb.org/3';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Movie]
    });

    service = TestBed.inject(Movie);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchMovies', () => {
    it('should return search results with query and page', () => {
      const mockResponse: MovieSearchResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Test Movie',
            overview: 'Test',
            poster_path: '/test.jpg',
            release_date: '2023-01-01',
            vote_average: 8.5,
            vote_count: 1000,
            adult: false,
            backdrop_path: '/backdrop.jpg'
          }
        ],
        total_pages: 1,
        total_results: 1
      };

      service.searchMovies('test', 1).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/search/movie?query=test&page=1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty query', () => {
      service.searchMovies('', 1).subscribe();
      const req = httpMock.expectOne(`${baseUrl}/search/movie?query=&page=1`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('getPopularMovies', () => {
    it('should return popular movies with default page', () => {
      const mockResponse: MovieSearchResponse = {
        page: 1,
        results: [
          {
            id: 1,
            title: 'Popular Movie',
            overview: 'Popular',
            poster_path: '/popular.jpg',
            release_date: '2023-01-01',
            vote_average: 9.0,
            vote_count: 2000,
            adult: false,
            backdrop_path: '/popular-backdrop.jpg'
          }
        ],
        total_pages: 1,
        total_results: 1
      };

      service.getPopularMovies().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/movie/popular?page=1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return popular movies with specified page', () => {
      service.getPopularMovies(2).subscribe();
      const req = httpMock.expectOne(`${baseUrl}/movie/popular?page=2`);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });
  });

  describe('getMovieDetails', () => {
    it('should return movie details by ID', () => {
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
        backdrop_path: '/backdrop.jpg',
        imdb_id: 'tt1234567',
        budget: 1000000,
        homepage: 'https://example.com',
        status: 'Released',
        revenue: 5000000,
        popularity: 75.5,
        adult: false
      };

      service.getMovieDetails(1).subscribe(movie => {
        expect(movie).toEqual(mockMovie);
      });

      const req = httpMock.expectOne(`${baseUrl}/movie/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMovie);
    });

    it('should handle error responses', () => {
      const errorMessage = '404 Not Found';
      
      service.getMovieDetails(999).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/movie/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});