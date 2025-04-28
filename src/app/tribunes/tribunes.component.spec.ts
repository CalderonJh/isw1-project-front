import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TribunesComponent } from './tribunes.component';

describe('TribunesComponent', () => {
  let component: TribunesComponent;
  let fixture: ComponentFixture<TribunesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TribunesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TribunesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
