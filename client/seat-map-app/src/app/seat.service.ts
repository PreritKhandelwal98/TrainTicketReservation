import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  private backendUrl = 'YOUR_BACKEND_URL'; // Replace with your backend URL

  constructor(private http: HttpClient) { }

  getSeats(): Observable<any> {
    return this.http.get(`${this.backendUrl}/seats`);
  }

  reserveSeats(numSeats: number): Observable<any> {
    return this.http.post(`${this.backendUrl}/reserve`, { numSeats });
  }
}
