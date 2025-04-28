import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardService } from '../admin-dashboard.service';
import { of } from 'rxjs';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockService: jasmine.SpyObj<AdminDashboardService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('AdminDashboardService', [
      'getDashboardInfo',
      'getTotalSportsEvents',
      'getTotalSubscriptions'
    ]);
    mockService.getDashboardInfo.and.returnValue(of({}));
    mockService.getTotalSportsEvents.and.returnValue(of(5));
    mockService.getTotalSubscriptions.and.returnValue(of(10));

    await TestBed.configureTestingModule({
      declarations: [AdminDashboardComponent],
      providers: [{ provide: AdminDashboardService, useValue: mockService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard info', () => {
    component.loadDashboardInfo();
    expect(mockService.getDashboardInfo).toHaveBeenCalled();
  });

  it('should load sports events count', () => {
    component.loadSportsEventsCount();
    expect(mockService.getTotalSportsEvents).toHaveBeenCalled();
    expect(component.totalSportsEvents).toBe(5);
  });

  it('should load subscriptions count', () => {
    component.loadSubscriptionsCount();
    expect(mockService.getTotalSubscriptions).toHaveBeenCalled();
    expect(component.totalSubscriptions).toBe(10);
  });
});
