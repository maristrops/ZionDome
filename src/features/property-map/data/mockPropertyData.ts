import type { Feature, FeatureCollection, Point, Polygon } from 'geojson';

import type { PropertyMapData, RiskMarkerProperties } from '../types';

const propertyBoundary: Feature<Polygon> = {
  type: 'Feature',
  properties: { name: 'ZionDome V1 Property' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-122.4329, 37.7632],
        [-122.4301, 37.7632],
        [-122.4301, 37.7612],
        [-122.4329, 37.7612],
        [-122.4329, 37.7632],
      ],
    ],
  },
};

const buildingFootprint: Feature<Polygon> = {
  type: 'Feature',
  properties: { name: 'Primary Structure' },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-122.4322, 37.7626],
        [-122.4308, 37.7626],
        [-122.4308, 37.7618],
        [-122.4322, 37.7618],
        [-122.4322, 37.7626],
      ],
    ],
  },
};

const riskMarkers: FeatureCollection<Point, RiskMarkerProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'risk-001',
        riskType: 'Combustible debris pile',
        severity: 'high',
        zone: 'Zone 1',
        recommendedAction: 'Remove debris and maintain a non-combustible perimeter.',
        status: 'open',
      },
      geometry: { type: 'Point', coordinates: [-122.4312, 37.76235] },
    },
    {
      type: 'Feature',
      properties: {
        id: 'risk-002',
        riskType: 'Overgrown shrubs near fence line',
        severity: 'medium',
        zone: 'Zone 2',
        recommendedAction: 'Trim shrub height and increase spacing between plantings.',
        status: 'in_progress',
      },
      geometry: { type: 'Point', coordinates: [-122.43245, 37.762] },
    },
    {
      type: 'Feature',
      properties: {
        id: 'risk-003',
        riskType: 'Tree canopy over roof edge',
        severity: 'medium',
        zone: 'Zone 3',
        recommendedAction: 'Prune canopy back from roof and chimney clearance.',
        status: 'open',
      },
      geometry: { type: 'Point', coordinates: [-122.43055, 37.76155] },
    },
  ],
};

export const mockPropertyMapData: PropertyMapData = {
  center: [-122.4315, 37.7622],
  propertyBoundary,
  buildingFootprint,
  riskMarkers,
};
