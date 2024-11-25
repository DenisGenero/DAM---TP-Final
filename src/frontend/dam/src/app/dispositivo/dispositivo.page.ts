import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Observable, Subscription, fromEvent, interval } from 'rxjs';
import { Dispositivo } from '../interfaces/dispositivo';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DispositivoPage implements OnInit {

  constructor(private _dispositivoService: DispositivoService) { }

  ngOnInit() {
    this._dispositivoService.getDispositivos()
      .then((data) => {
        console.log(data)
    })
      .catch((error) => {
        console.log(error)
      })
  }

}
