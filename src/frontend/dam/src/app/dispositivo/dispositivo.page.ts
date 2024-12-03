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
    private http: HttpClient
  ) {}

  goBack() {
    this.navCtrl.back();  // Vuelve a la página anterior en el stack de navegación
  }

  // Controlador botón electrovalvula
  async toggleButton(id: number) {
      this.apertura = !this.apertura; // Alternar estado

      // Actualizar color y texto del botón
      this.buttonText = this.apertura ? 'Cerrar EV' : 'Abrir EV';
      this.buttonColor = this.apertura ? 'danger' : 'success';
  
      // ID de la válvula (dispositivo)
      const electrovalvulaId = id;
      
      // Enviar solicitud al backend
      const body = { apertura: this.apertura };
      try {
        // Llamar a la función del servicio
        await this._dispositivoService.postMediciones(electrovalvulaId, body);
        window.location.reload();
        console.log('Estado de la válvula actualizado correctamente.');
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

  ngOnInit() {
    // Obtener el ID de la URL
    const id = this.route.snapshot.paramMap.get('id'); 
        if (id) {
          this._dispositivoService.getDispositivo(+id)
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
        }
  }
}
