import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonGrid, IonRow, IonCol} from '@ionic/angular/standalone';
import { DispositivoService } from '../services/dispositivo.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonList, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol
  ]
})
export class DispositivoPage implements OnInit {

  dispositivo: any = {};
  // Propiedades de los botones
  buttonText = 'Abrir EV';
  buttonColor = 'success';

  constructor(
    private route: ActivatedRoute,
    private _dispositivoService: DispositivoService,
    private navCtrl: NavController
  ) {}

  goBack() {
    this.navCtrl.back();  // Vuelve a la página anterior en el stack de navegación
  }

  // Controlador botón electrovalvula
  toggleButton() {
    if (this.buttonText === 'Abrir EV') {
      this.buttonText = 'Cerrar EV';
      this.buttonColor = 'danger'; // Rojo
    } else {
      this.buttonText = 'Abrir EV';
      this.buttonColor = 'success'; // Verde
    }
  }

  ngOnInit() {
    // Obtener el ID de la URL
    const id = this.route.snapshot.paramMap.get('id'); 

    // Llamar al servicio para obtener el dispositivo
    if (id) {
      this._dispositivoService.getDispositivo(+id) // Convertir id a número si es necesario
        .then((data) => {
          this.dispositivo = data; // Guardar el dispositivo obtenido
          console.log('Dispositivo obtenido:', this.dispositivo);
        })
        .catch((error) => {
          console.error('Error al obtener el dispositivo:', error);
        });
    }
  }
}
