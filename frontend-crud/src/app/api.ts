import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/tareas'; // La URL de tu backend de Node

  constructor(private http: HttpClient) { }

  getTareas(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  crearTarea(tarea: any): Observable<any> {
    return this.http.post(this.apiUrl, tarea);
  }

  actualizarTarea(id: string, tarea: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tarea);
  }

  eliminarTarea(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}