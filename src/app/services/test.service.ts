import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor() { }
  
  getMessage(): string {
    return 'Test toimii!';
  }
}