import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication.service';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})

export class TripCardComponent implements OnInit {
  @Input('trip') trip: any;

  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }


  ngOnInit(): void {
  }

  public editTrip(trip: Trip) {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public deleteTrip(): void {
  this.tripDataService.deleteTrip(this.trip.code)
    .subscribe({
      next: () => {
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
}


  public isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

}
