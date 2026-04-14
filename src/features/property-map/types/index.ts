import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Point,
  Polygon,
  Position,
} from 'geojson';

export type RiskSeverity = 'low' | 'medium' | 'high';
export type RiskStatus = 'open' | 'in_progress' | 'resolved';

export interface RiskMarkerProperties {
  id: string;
  riskType: string;
  severity: RiskSeverity;
  zone: 'Zone 1' | 'Zone 2' | 'Zone 3';
  recommendedAction: string;
  status: RiskStatus;
}

export type RiskMarkerFeature = Feature<Point, RiskMarkerProperties>;

export interface PropertyMapData {
  center: Position;
  propertyBoundary: Feature<Polygon>;
  buildingFootprint: Feature<Polygon>;
  riskMarkers: FeatureCollection<Point, RiskMarkerProperties>;
}

export type DefenseZoneFeature = Feature<Polygon | MultiPolygon, { zone: 'Zone 1' | 'Zone 2' | 'Zone 3' }>;

export interface LayerConfig {
  id: string;
  label: string;
  defaultVisible: boolean;
  description?: string;
}
