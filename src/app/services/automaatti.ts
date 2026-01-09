import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Automaatti {
  
// REST API:n perusosoite
  private apiUrl = 'http://localhost:8080/api';
  
  // HTTP-headerit (jos tarvitaan)
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
   constructor(private http: HttpClient) { }

}
