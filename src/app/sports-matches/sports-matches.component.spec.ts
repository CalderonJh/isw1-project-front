import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsMatchesComponent } from './sports-matches.component';

describe('SportsMatchesComponent', () => {
  let component: SportsMatchesComponent;
  let fixture: ComponentFixture<SportsMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportsMatchesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportsMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
