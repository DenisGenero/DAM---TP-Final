import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Dispositivo, Electrovalvula, Mediciones } from '../interfaces/dispositivo';

@Injectable({
  providedIn: 'root'
})
export class DispositivoService {

  constructor(private _http: HttpClient) { }

  getDispositivos (): Promise<Dispositivo[]> {
    return firstValueFrom(this._http.get<Dispositivo[]>('http://localhost:8000/dispositivo'))
  }

  getDispositivo (id: number): Promise<{dispositivo: Dispositivo, medicion: Mediciones}> {
    return firstValueFrom(this._http.get<{dispositivo: Dispositivo, medicion: Mediciones}>(`http://localhost:8000/dispositivo/${id}`))
  }

  getMediciones(id: number): Promise<Mediciones[]>{
    return firstValueFrom(this._http.get<Mediciones[]>(`http://localhost:8000/dispositivo/${id}/mediciones`))
  }

  postMediciones(id: number, body: any){
    return firstValueFrom(this._http.post(`http://localhost:8000/dispositivo/${id}/valvula`, body))
  }

  getEstadoElectrovalvula(id: number): Promise<any> {
    return firstValueFrom(this._http.get<any>(`http://localhost:8000/dispositivo/${id}/valvula/${id}`));
  }
}
