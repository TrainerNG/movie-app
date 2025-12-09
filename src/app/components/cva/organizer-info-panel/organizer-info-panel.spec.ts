import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerInfoPanel } from './organizer-info-panel';

describe('OrganizerInfoPanel', () => {
  let component: OrganizerInfoPanel;
  let fixture: ComponentFixture<OrganizerInfoPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerInfoPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerInfoPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
