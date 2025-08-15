import { TrackingItem } from "./TrackingItem";

export interface TrackingResponse {
  success: boolean;
  data: TrackingItem[];
  error?: string;
}