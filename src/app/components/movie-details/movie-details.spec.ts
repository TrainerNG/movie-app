import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDetails } from './movie-details';
import { ActivatedRoute } from '@angular/router';

describe('MovieDetails', () => {
  let component: MovieDetails;
  let fixture: ComponentFixture<MovieDetails>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot:{
        paramMap:{
          get: jasmine.createSpy('get').and.returnValue('encrypted123')
        }
      }
    }
    await TestBed.configureTestingModule({
      imports: [MovieDetails],
      providers:[
        {
          provide:ActivatedRoute,useValue:mockActivatedRoute
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
