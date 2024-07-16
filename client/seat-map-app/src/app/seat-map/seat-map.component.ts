// src/app/seat-map/seat-map.component.ts
import { Component, OnInit } from '@angular/core';
import { SeatService } from '../seat.service';

@Component({
  selector: 'app-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.css']
})
export class SeatMapComponent implements OnInit {
  seats: any[] = [];
  numSeats: number = 1;
  reservedSeats: any[] = [];
  error: string = '';

  constructor(private seatService: SeatService) { }

  ngOnInit(): void {
    this.fetchSeats();
  }

  fetchSeats(): void {
    this.seatService.getSeats().subscribe(
      data => this.seats = data,
      error => console.error('Error fetching seats:', error)
    );
  }

  handleReserve(): void {
    if (this.numSeats > 7) {
      this.error = 'You can reserve up to 7 seats at a time.';
      return;
    }

    this.seatService.reserveSeats(this.numSeats).subscribe(
      data => {
        if (data.length === 0) {
          this.error = 'Not enough seats available';
        } else {
          this.reservedSeats = data;
          this.fetchSeats();
          this.error = '';
        }
      },
      error => {
        if (error.status === 400) {
          this.error = 'Not enough seats available';
        } else {
          console.error('Error reserving seats:', error);
        }
      }
    );
  }
}
