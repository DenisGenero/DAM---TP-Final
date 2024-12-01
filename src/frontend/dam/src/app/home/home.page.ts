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
  dispositivos: any

  async ngOnInit() {
    try {
      this.dispositivos = await this._dispositivoService.getDispositivos();
      console.log(this.dispositivos.dispositivoId)
    } catch (error) {
      console.error('Error al obtener dispositivos:', error);
    }
  }
}
