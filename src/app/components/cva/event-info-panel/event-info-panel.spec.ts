import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventInfoPanel } from './event-info-panel';

describe('EventInfoPanel', () => {
  let component: EventInfoPanel;
  let fixture: ComponentFixture<EventInfoPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventInfoPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
