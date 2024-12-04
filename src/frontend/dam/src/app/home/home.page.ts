import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router'
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { DispositivoService } from '../services/dispositivo.service';
import {HoverEffectDirective } from '../efectos/hover-effect.directive'
import { Dispositivo } from '../interfaces/dispositivo';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, RouterModule, NgFor, HoverEffectDirective
  ],
})
export class HomePage {
  constructor(private _dispositivoService: DispositivoService) {}
  dispositivos: Dispositivo[] = []

  async ngOnInit() {
    // Cargar los sensores al iniciar la página
    await this._dispositivoService.getDispositivos()
      .then((dispositivos) => {
        this.dispositivos = dispositivos;
      })
      .catch((error) => {
        console.error('Error al obtener dispositivos:', error);
      });
  }
}
