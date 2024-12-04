export interface Dispositivo {
    dispositivoId: number,
    nombre: string,
    ubicacion: string,
    ElectrovalvulaId: number,
}

export interface Mediciones{
    humedad: number,
    fecha: Date,
}

export interface Electrovalvula{
    apertura: number,
}