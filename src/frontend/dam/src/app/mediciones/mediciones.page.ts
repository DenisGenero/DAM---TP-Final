import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel,
  IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonGrid, IonRow, IonCol} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { DispositivoService } from '../services/dispositivo.service';
import { FechaHoraPipe } from '../pipes/fecha-hora.pipe';

@Component({
  selector: 'app-mediciones',
  templateUrl: './mediciones.page.html',
  styleUrls: ['./mediciones.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonList, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol, FechaHoraPipe
    ]
})

export class MedicionesPage implements OnInit {
  mediciones: any[] = [];

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private dispositivoService: DispositivoService
  ) {}

  ngOnInit() {
    const dispositivoId = this.route.snapshot.paramMap.get('id');
    if (dispositivoId) {
      this.dispositivoService.getMediciones(+dispositivoId)
        .then((data: any) => {
          this.mediciones = Array.isArray(data) ? data : [];
        })
        .catch((error) => {
          console.error('Error al obtener mediciones:', error);
        });
    }
  }

  goBack() {
    this.navCtrl.back(); // Regresar a la página anterior
  }
}
