import { Injectable } from '@angular/core';
import { ExchangeRateService } from '../../managers/exchange-rate.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalDataCase {
  constructor(private exchangeRateService: ExchangeRateService) {}

  getExchangeRates(currency: string): Observable<any> {
    return this.exchangeRateService.getExchangeRates(currency);
  }
}
