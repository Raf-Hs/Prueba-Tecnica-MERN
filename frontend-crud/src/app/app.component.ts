import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api';

@Component({
  selector: 'app-root',
  standalone: true,
  // ¡Aquí importamos los módulos que arreglan tus errores!
  imports: [CommonModule, FormsModule, RouterOutlet], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  tareas: any[] = [];
  nuevaTareaTitulo: string = '';
  nuevaTareaDescripcion: string = '';
  tareaEditando: string | null = null;
  tituloEditando: string = '';
  tareaSeleccionada: any = null;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarTareas();
  }

  cargarTareas() {
    this.apiService.getTareas().subscribe(data => {
      this.tareas = data;
      this.cdr.detectChanges();
    });
  }

  agregarTarea() {
    if (!this.nuevaTareaTitulo) return;
    
    const nueva = { 
      titulo: this.nuevaTareaTitulo.trim(), 
      descripcion: this.nuevaTareaDescripcion ? this.nuevaTareaDescripcion.trim() : '',
      completada: false 
    };
    
    this.apiService.crearTarea(nueva).subscribe({
      next: (respuestaBackend) => {
        this.nuevaTareaTitulo = '';
        this.nuevaTareaDescripcion = '';
        this.cargarTareas();
      },
      error: (errorHttp) => {
        console.error('Error al crear tarea:', errorHttp);
      }
    });
  }

  verDetalle(tarea: any) {
    this.tareaSeleccionada = tarea;
    this.cdr.detectChanges();
  }

  cerrarDetalle() {
    this.tareaSeleccionada = null;
    this.cdr.detectChanges();
  }

  iniciarEdicion(tarea: any) {
    this.tareaEditando = tarea._id;
    this.tituloEditando = tarea.titulo;
    this.cdr.detectChanges();
  }

  guardarEdicion(tarea: any) {
    if (!this.tituloEditando.trim()) return;
    tarea.titulo = this.tituloEditando;
    this.apiService.actualizarTarea(tarea._id, tarea).subscribe({
      next: () => {
        this.tareaEditando = null;
        this.cargarTareas();
      },
      error: (err) => console.error(err)
    });
    this.cdr.detectChanges();
  }

  cancelarEdicion() {
    this.tareaEditando = null;
    this.cdr.detectChanges();
  }

  eliminarTarea(id: string) {
    this.apiService.eliminarTarea(id).subscribe(() => {
      this.cargarTareas();
    });
    this.cdr.detectChanges();
  }
}