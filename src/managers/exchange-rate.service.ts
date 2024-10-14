import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private apiKey = 'da0e008f5cd600a8efd6f57c'; // Tu clave de API
  private baseUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}`;

  constructor(private http: HttpClient) {}

  getExchangeRates(base: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/latest/${base}`);
  }
}
