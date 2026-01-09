import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rest, RestConfig } from '../../services/rest';
import { Configuration } from '../../services/configuration';

@Component({
  selector: 'app-ajanvaraus',
  imports: [CommonModule, FormsModule],
  templateUrl: './ajanvaraus.html',
  styleUrl: './ajanvaraus.css'
})
export class AjanvarausComponent implements OnInit {
  
  hetu: string = '';
  ajanvaraukset: any[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private restService: Rest,
    private configService: Configuration
  ) { }

  ngOnInit(): void {
    console.log('Ajanvaraus component initialized');
    console.log('Config:', this.configService.getConfig());
  }

  haeAjanvaraukset(): void {
    this.ajanvaraukset = [];
    this.error = '';
    
    if (!this.hetu || this.hetu.length !== 11) {
      this.error = 'Syötä kelvollinen henkilötunnus (11 merkkiä)';
      return;
    }

    this.loading = true;

    const configs = this.configService.getServiceQueueConfigs();
    if (configs.length === 0) {
      this.error = 'Konfiguraatiota ei löytynyt';
      this.loading = false;
      return;
    }

    const firstConfig = configs[0];
    const restConfig: RestConfig = {
      authorization: firstConfig.authorization,
      uri: firstConfig.URI,
      viewId: firstConfig.viewId,
      homeViewId: firstConfig.homeViewId,
      ptjId: firstConfig.ptjId,
      requestTimeout: this.configService.getRequestTimeout()
    };

    this.restService.getServiceQueueRegistrations(
      restConfig,
      this.hetu,
      this.configService.getPreferredLanguage()
    ).subscribe({
      next: (data: any) => {
        console.log('Vastaus:', data);
        this.ajanvaraukset = Array.isArray(data) ? data : [data];
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Virhe:', err);
        this.error = 'Virhe haettaessa ajanvarauksia: ' + err.message;
        this.loading = false;
      }
    });
  }
}