import { Component, OnInit } from '@angular/core';
import { TrackingItem } from '../../models/TrackingItem';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParsedTrackingItem } from '../../models/ParsedTrackingItem';
import { OcaTrackingService } from '../../services/oca-tracking.service';
import { TrackingRequest } from '../../models/TrackingRequest';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-oca-tracking',
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './oca-tracking.component.html',
  styleUrl: './oca-tracking.component.css'
})
export class OcaTrackingComponent {

  trackingForm: FormGroup;
  trackingData: TrackingItem[] = [];
  parsedData: ParsedTrackingItem[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private trackingService: OcaTrackingService
  ) {
    this.trackingForm = this.fb.group({
      NroDocumentoCliente: [''],
      CUIT: ['', [this.cuitValidator]],
      Pieza: ['', [this.piezaValidator]]
    });
  }

  cuitValidator(control: any) {
    if (!control.value) return null;
    
    const cuitPattern = /^\d{2}-\d{8}-\d{1}$/;
    return cuitPattern.test(control.value) ? null : { invalidCuit: true };
  }

  piezaValidator(control: any) {
    if (!control.value) return null;
    
    const piezaPattern = /^\d{19}$/;
    return piezaPattern.test(control.value) ? null : { invalidPieza: true };
  }

  isFormValid(): boolean {
    const values = this.trackingForm.value;
    
    if (values.Pieza && values.Pieza.length === 19) {
      return true;
    }
    
    if (!values.Pieza && values.NroDocumentoCliente && values.CUIT) {
      return !this.trackingForm.get('CUIT')?.errors;
    }
    
    return false;
  }

  onSubmit(): void {
    if (!this.isFormValid() || this.isLoading) return;

    this.isLoading = true;
    this.error = null;

    const request: TrackingRequest = this.trackingForm.value;

    this.trackingService.trackPackage(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.trackingData = response.data;
          this.parsedData = this.trackingService.parsedTrackingItems(response.data);
          this.error = null;
          
          if (this.trackingData.length === 0) {
            this.error = 'No se encontraron datos para el envío consultado.';
          }
        } else {
          this.error = response.error || 'Error desconocido';
          this.trackingData = [];
          this.parsedData = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Error de conexión. Por favor, intente nuevamente.';
        this.trackingData = [];
        this.parsedData = [];
        console.error('Error:', err);
      }
    });
  }

  clearForm(): void {
    this.trackingForm.reset();
    this.trackingData = [];
    this.parsedData = [];
    this.error = null;
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }

  getStatusIcon(estado: string): string {
    const icons = {
      'en-proceso': '⏳',
      'retirado': '📤',
      'procesado': '⚙️',
      'en-viaje': '🚛',
      'entregado': '✅',
      'otros': '📋'
    };
    return icons[estado as keyof typeof icons] || '📋';
  }

}
