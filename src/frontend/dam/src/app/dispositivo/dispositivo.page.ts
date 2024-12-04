import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router'
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonGrid, IonRow, IonCol} from '@ionic/angular/standalone';
import { DispositivoService } from '../services/dispositivo.service';
import { NavController } from '@ionic/angular';
import { FechaHoraPipe } from '../pipes/fecha-hora.pipe';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonList, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol, FechaHoraPipe, RouterModule
  ]
})

export class DispositivoPage implements OnInit {

  dispositivo: any = {};
  ultimaMedicion: any = null;

  // Propiedades de los botones
  buttonText = 'Abrir EV';
  buttonColor = 'success';
  apertura = false;

  constructor(
    private route: ActivatedRoute,
    private _dispositivoService: DispositivoService,
    private navCtrl: NavController,
  ) {}

  goBack() {
    this.navCtrl.back();  // Vuelve a la página anterior en el stack de navegación
  }

  // Controlador botón electrovalvula
  async toggleButton(id: number) {
      await this._dispositivoService.getEstadoElectrovalvula(+id)
      .then((estado) => {
        //this.apertura = !!estado;
        // Invertir el estado
        console.log("estado en toggle 0:", estado.apertura)
        this.apertura = estado.apertura? false : true
      })
      .catch((error) => {
        console.error('Error al obtener el estado de la electroválvula:', error);
      });
  
      // ID de la válvula (dispositivo)
      const electrovalvulaId = id;
      
      // Enviar solicitud al backend
      console.log("estado en toggle 1:", this.apertura)
      const body = { apertura: this.apertura };
      console.log("estado en toggle 2:", this.apertura)
      try {
        // Llamar a la función del servicio
        await this._dispositivoService.postMediciones(electrovalvulaId, body);
        console.log('Estado de la válvula actualizado correctamente.', body);
      } catch (error) {
        console.error('Error al actualizar válvula:', error);
      }
  }

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
            .then((data: any) => {
              this.dispositivo = data; // Guardar el dispositivo obtenido
              this.ultimaMedicion = {
                valor: data.ultimaMedicionValor,
                fecha: data.ultimaMedicionFecha
              };
            })
            .catch((error) => {
              console.error('Error al obtener el dispositivo:', error);
            });

            // Estado de la electrovalvula
            await this._dispositivoService.getEstadoElectrovalvula(+id)
            .then((estado) => {
              this.apertura = estado.apertura? true : false;
              console.log("estado en init:", estado.apertura)
              console.log("apertura en init:", this.apertura)
            })
            .catch((error) => {
              console.error('Error al obtener el estado de la electroválvula:', error);
            });
        }
  }
}
