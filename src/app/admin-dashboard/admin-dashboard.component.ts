// src/app/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../admin-dashboard.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  dashboardInfo: any;
  totalSportsEvents: number = 0;
  totalSubscriptions: number = 0;

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.loadDashboardInfo();
    this.loadSportsEventsCount();
    this.loadSubscriptionsCount();
  }

  loadDashboardInfo(): void {
    this.dashboardService.getDashboardInfo().subscribe({
      next: (data) => {
        this.dashboardInfo = data;
      },
      error: (err) => {
        console.error('Error loading dashboard info', err);
      }
    });
  }

  loadSportsEventsCount(): void {
    this.dashboardService.getTotalSportsEvents().subscribe(count => {
      this.totalSportsEvents = count;
    });
  }

  loadSubscriptionsCount(): void {
    this.dashboardService.getTotalSubscriptions().subscribe(count => {
      this.totalSubscriptions = count;
    });
  }
}
