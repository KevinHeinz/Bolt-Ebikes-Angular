import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../general/country';
import { map } from 'rxjs/operators';
import { State } from '../general/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EbikesFormService {

  private countriesUrl = environment.boltEbikesApiUrl + '/countries';
  private statesUrl = environment.boltEbikesApiUrl + '/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]> {

    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCcMonths(fromMonth: number): Observable<number[]> {

    let data: number[] = [];

    for (let theMonth = fromMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    for (let theMonth = 1; theMonth < fromMonth; theMonth++) {
      data.push(theMonth);
    }

    return of(data);
  }

  getCcYears(): Observable<number[]> {

    let data: number[] = [];

    const fromYear: number = new Date().getFullYear();
    const toYear: number = fromYear + 10;
    
    for (let theYear = fromYear; theYear <= toYear; theYear++) {
      data.push(theYear);
    }

    return of(data);

  }
}

interface GetResponseCountries {
  
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  
  _embedded: {
    states: State[];
  }
}
