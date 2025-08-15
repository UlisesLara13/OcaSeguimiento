import { TrackingItem } from "./TrackingItem";

export interface ParsedTrackingItem extends TrackingItem {
  fechaParsed: Date;
  estado: 'en-proceso' | 'retirado' | 'procesado' | 'en-viaje' | 'entregado' | 'otros';
}