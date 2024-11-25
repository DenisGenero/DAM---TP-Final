import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Dispositivo } from '../interfaces/dispositivo';


@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  constructor(private _http: httpClient) { }

  getDispositivos(): Dispositivo[] {
    return firstValueFrom(this._http.get<Dispositivo[]>('http://localhost:8000/dispositivo'))
  }
}
