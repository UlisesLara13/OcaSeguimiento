import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TrackingRequest } from '../models/TrackingRequest';
import { TrackingResponse } from '../models/TrackingResponse';
import { catchError, map, Observable, of } from 'rxjs';
import { TrackingItem } from '../models/TrackingItem';
import { ParsedTrackingItem } from '../models/ParsedTrackingItem';

@Injectable({
  providedIn: 'root'
})
export class OcaTrackingService {

  private readonly API_URL = '/api/oca/Tracking_Pieza';

  constructor(private http: HttpClient) {}

  trackPackage(request: TrackingRequest): Observable<TrackingResponse> {
    let params = new HttpParams();
    
    if (request.NroDocumentoCliente) {
      params = params.set('NroDocumentoCliente', request.NroDocumentoCliente);
    }
    if (request.CUIT) {
      params = params.set('CUIT', request.CUIT);
    }
    if (request.Pieza) {
      params = params.set('Pieza', request.Pieza);
    }

    return this.http.get(this.API_URL, { 
      params, 
      responseType: 'text' 
    }).pipe(
      map((xmlResponse: string) => this.parseXmlResponse(xmlResponse)),
      catchError((error: HttpErrorResponse) => {
        console.error('Error tracking package:', error);
        return of({
          success: false,
          data: [],
          error: 'Error al conectar con el servicio de OCA. Verifique su conexión.'
        });
      })
    );
  }

  private parseXmlResponse(xmlString: string): TrackingResponse {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Error parsing XML');
      }

      const tables = xmlDoc.querySelectorAll('Table');
      const trackingItems: TrackingItem[] = [];

      tables.forEach(table => {
        const item: TrackingItem = {
          NumeroEnvio: this.getElementText(table, 'NumeroEnvio'),
          Descripcion_Motivo: this.getElementText(table, 'Descripcion_Motivo'),
          Desdcripcion_Estado: this.getElementText(table, 'Desdcripcion_Estado'),
          SUC: this.getElementText(table, 'SUC'),
          fecha: this.getElementText(table, 'fecha')
        };
        trackingItems.push(item);
      });

      return {
        success: true,
        data: trackingItems
      };
    } catch (error) {
      console.error('Error parsing XML:', error);
      return {
        success: false,
        data: [],
        error: 'Error al procesar la respuesta del servidor'
      };
    }
  }

  private getElementText(parent: Element, tagName: string): string {
    const element = parent.querySelector(tagName);
    return element ? element.textContent || '' : '';
  }

  parsedTrackingItems(items: TrackingItem[]): ParsedTrackingItem[] {
    return items.map(item => ({
      ...item,
      fechaParsed: new Date(item.fecha),
      estado: this.determineEstado(item.Desdcripcion_Estado)
    })).sort((a, b) => b.fechaParsed.getTime() - a.fechaParsed.getTime());
  }

  private determineEstado(descripcion: string): 'en-proceso' | 'retirado' | 'procesado' | 'en-viaje' | 'entregado' | 'otros' {
    const desc = descripcion.toLowerCase();
    
    if (desc.includes('en proceso')) return 'en-proceso';
    if (desc.includes('retirado')) return 'retirado';
    if (desc.includes('procesado')) return 'procesado';
    if (desc.includes('en viaje') || desc.includes('viaje')) return 'en-viaje';
    if (desc.includes('entregado')) return 'entregado';
    
    return 'otros';
  }

}
