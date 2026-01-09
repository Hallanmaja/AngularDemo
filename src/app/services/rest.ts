import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

// Interfaces tyypitykselle
export interface RestConfig {
  authorization: string;
  uri: string;
  viewId?: string;
  homeViewId?: string;
  ptjId?: number;
  requestTimeout: number;
}

export interface ServiceQueueRegistration {
  // Lisää tarvittavat kentät
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class Rest {

  constructor(private http: HttpClient) { }

  /**
   * Hakee palvelut päivämäärällä
   * Vastaa vanhaa: getServicesRest()
   */
  getServicesRest(
    config: RestConfig,
    date: Date
  ): Observable<any> {
    const formattedDate = this.formatDate(date);
    const fullUri = `${config.uri}/${config.homeViewId}/${formattedDate}`;
    
    const headers = new HttpHeaders({
      'Authorization': config.authorization,
      'Accept': 'application/json'
    });

    return this.http.get(fullUri, { headers })
      .pipe(
        timeout(config.requestTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * Hakee kioskin konfiguraatiot
   * Vastaa vanhaa: getConfigsForKiosk()
   */
  getConfigsForKiosk(config: RestConfig): Observable<any> {
    const fullUri = `${config.uri}/${config.homeViewId}`;
    
    const headers = new HttpHeaders({
      'Authorization': config.authorization,
      'Accept': 'application/json'
    });

    return this.http.get(fullUri, { headers })
      .pipe(
        timeout(config.requestTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * Hakee käännökset
   * Vastaa vanhaa: getTranslations()
   */
  getTranslations(
    config: RestConfig,
    language: string
  ): Observable<any> {
    const fullUri = `${config.uri}/${config.homeViewId}`;
    
    const headers = new HttpHeaders({
      'Authorization': config.authorization,
      'Accept': 'application/json'
    });

    return this.http.get(fullUri, { headers })
      .pipe(
        timeout(config.requestTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * Hakee jonorekisteröinnit HETU:lla
   * Vastaa vanhaa: getServiceQueueRegistrations()
   */
  getServiceQueueRegistrations(
    config: RestConfig,
    identityCode: string,
    language: string
  ): Observable<any> {
    
    // HETU-validointi
    if (!this.isValidHetu(identityCode)) {
      return throwError(() => new Error('Invalid HETU'));
    }

    // Rakenna URI parametreineen
    let uri = `${config.uri}/${identityCode}?lang=${language}`;
    if (config.viewId) {
      uri += `&viewId=${config.viewId}`;
    }
    if (config.ptjId) {
      uri += `&ptjId=${config.ptjId}`;
    }
    if (config.homeViewId) {
      uri += `&homeViewId=${config.homeViewId}`;
    }

    const headers = new HttpHeaders({
      'Authorization': config.authorization,
      'Accept': 'application/json'
    });

    return this.http.get(uri, { headers })
      .pipe(
        timeout(config.requestTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * Luo uuden jonorekisteröinnin
   * Vastaa vanhaa: createServiceQueueRegistration()
   */
  createServiceQueueRegistration(
    config: RestConfig,
    serviceQueueRegistration: ServiceQueueRegistration,
    printerName: string,
    language: string
  ): Observable<any> {
    
    // Rakenna URI parametreineen
    let uri = `${config.uri}?printerName=${printerName}&lang=${language}`;
    if (config.viewId) {
      uri += `&viewId=${config.viewId}`;
    }
    if (config.ptjId) {
      uri += `&ptjId=${config.ptjId}`;
    }
    if (config.homeViewId) {
      uri += `&homeViewId=${config.homeViewId}`;
    }

    const headers = new HttpHeaders({
      'Authorization': config.authorization,
      'Content-Type': 'application/json'
    });

    return this.http.post(uri, serviceQueueRegistration, { headers })
      .pipe(
        timeout(config.requestTimeout),
        catchError(this.handleError)
      );
  }

  /**
   * Tarkistaa kalenterin vapaan tilan
   * Vastaa vanhaa: getCalendarFreeStatus()
   */
  getCalendarFreeStatus(
    config: RestConfig,
    profileId: number,
    date: Date,
    defaultOnError: boolean = false
  ): Observable<boolean> {
    
    // Jos profileId puuttuu, palauta oletusarvo
    if (!profileId || profileId === 0) {
      return new Observable(observer => {
        setTimeout(() => {
          observer.next(defaultOnError);
          observer.complete();
        }, 10);
      });
    }

    const formattedDate = this.formatDate(date);
    const uri = `${config.uri}/${profileId}/${formattedDate}`;

    const headers = new HttpHeaders({
      'Authorization': config.authorization,
      'Accept': 'application/json'
    });

    return new Observable<boolean>(observer => {
      this.http.get<any>(uri, { headers })
        .pipe(
          timeout(config.requestTimeout),
          catchError((error: HttpErrorResponse) => {
            // Jos 404, tulkitaan vapaaksi
            if (error.status === 404) {
              observer.next(true);
              observer.complete();
            } else {
              console.error('getCalendarFreeStatus error:', error.status, error.statusText);
              observer.next(defaultOnError);
              observer.complete();
            }
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (response) => {
            const bookings = response.booking || [];
            let free = true;
            
            // Tarkista onko päivämäärä varausten sisällä
            bookings.forEach((booking: any) => {
              if (this.isBetween(date, booking.startTime, booking.endTime)) {
                free = false;
              }
            });
            
            observer.next(free);
            observer.complete();
          },
          error: () => {
            // Virhe käsitelty jo catchError:ssa
          }
        });
    });
  }

  /**
   * HETU-validointi
   * Kopio vanhasta: isValidHetu()
   */
  private isValidHetu(hetu: string): boolean {
    if (!hetu || hetu.length !== 11) {
      return false;
    }

    const day = parseInt(hetu.substring(0, 2), 10);
    const month = parseInt(hetu.substring(2, 4), 10);
    const year = parseInt(hetu.substring(4, 6), 10);
    const century = hetu.charAt(6);
    const individual = parseInt(hetu.substring(7, 10), 10);
    const checkChar = hetu.charAt(10);

    // Tarkista päivämäärä
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return false;
    }

    // Tarkista vuosisatamerkki
    const validCenturies = ['+', '-', 'Y', 'X', 'W', 'V', 'U', 'A', 'B', 'C', 'D', 'E', 'F'];
    if (!validCenturies.includes(century)) {
      return false;
    }

    // Tarkista tarkistusmerkki
    const checkString = '0123456789ABCDEFHJKLMNPRSTUVWXY';
    const dateNumber = parseInt(hetu.substring(0, 6) + hetu.substring(7, 10), 10);
    const remainder = dateNumber % 31;
    
    return checkChar === checkString.charAt(remainder);
  }

  /**
   * Muotoilee päivämäärän ISO-muotoon
   */
  private formatDate(date: Date): string {
    return date.toISOString();
  }

  /**
   * Tarkistaa onko päivämäärä kahden päivämäärän välissä
   */
  private isBetween(date: Date, start: string, end: string): boolean {
    const dateTime = date.getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return dateTime >= startTime && dateTime <= endTime;
  }

  /**
   * Virheiden käsittely
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side virhe
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side virhe
      errorMessage = `Error ${error.status}: ${error.statusText}`;
    }
    
    console.error('REST Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}