import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router'
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonGrid, IonRow, IonCol} from '@ionic/angular/standalone';
import { DispositivoService } from '../services/dispositivo.service';
import { Dispositivo, Mediciones } from '../interfaces/dispositivo';
import { NavController } from '@ionic/angular';
import { FechaHoraPipe } from '../pipes/fecha-hora.pipe';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonList, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol, FechaHoraPipe, RouterModule, 
  ]
})

export class DispositivoPage implements OnInit {
  // Instancia de dispositivo vacía
  dispositivo: Dispositivo = {dispositivoId: 0, nombre:'', ubicacion:'', ElectrovalvulaId: 0};
  ultimaMedicion: Mediciones = {humedad: 0, fecha: new Date(0)};

  // Propiedad de la válvula asociada al botón
  apertura = false;

  constructor(
    private route: ActivatedRoute,
    private _dispositivoService: DispositivoService,
    private navCtrl: NavController,
  ) {}

  // Vuelve a la página anterior en el stack de navegación
  goBack() {
    this.navCtrl.back();
  }

  // Controlador botón electrovalvula
  async toggleButton(id: number) {
    // Traer el estado de la electroválvula
      await this._dispositivoService.getEstadoElectrovalvula(+id)
      .then((estado) => {
        // Invertir estado de la electrovalvula
        this.apertura = estado.apertura? false : true
      })
      .catch((error) => {
        console.error('Error al obtener el estado de la electroválvula:', error);
      });
  
      // ID de la válvula (dispositivo)
      const electrovalvulaId = id;
      
      // Enviar solicitud al backend
      const body = { apertura: this.apertura };
      await this._dispositivoService.postMediciones(electrovalvulaId, body)
        .then(response => {
          console.log('Válvula actualizada exitosamente:', response);
        })
        .catch(error => {
          console.error('Error al actualizar válvula:', error);
        });

      // Actualizar mediciones:
      await this._dispositivoService.getDispositivo(+id)
        .then((data) => {
          this.dispositivo = data.dispositivo;
          this.ultimaMedicion = data.medicion
        })
        .catch((error) => {
          console.error('Error al obtener el dispositivo:', error);
        });

  }

  // Mostrar el historial de mediciones
  irAMediciones(dispositivoId: number) {
    if (dispositivoId) {
      this.navCtrl.navigateForward(`${dispositivoId}/mediciones`);
    } else {
      console.error('El ID del dispositivo no está disponible.');
    }
  }

  async ngOnInit() {
    // Obtener el ID de la URL
    const id = this.route.snapshot.paramMap.get('id'); 
        if (id) {
          await this._dispositivoService.getDispositivo(+id)
            .then((data) => {
              this.dispositivo = data.dispositivo;
              this.ultimaMedicion = data.medicion
            })
            .catch((error) => {
              console.error('Error al obtener el dispositivo:', error);
            });

            // Estado de la electrovalvula
            await this._dispositivoService.getEstadoElectrovalvula(+id)
            .then((estado) => {
              this.apertura = estado.apertura? true : false;
            })
            .catch((error) => {
              console.error('Error al obtener el estado de la electroválvula:', error);
            });
        }
  }
}
