import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private apiKey = 'e73b5c23d0c4f5deaf85e9ed'; // Tu clave de API
  private baseUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/`;

  constructor(private http: HttpClient) {}

  getExchangeRates(base: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${base}`);
  }
}
