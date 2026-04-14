import type { LayerConfig } from '../types';

export const layerRegistry: LayerConfig[] = [
  { id: 'orthophoto', label: 'Orthophoto', defaultVisible: true },
  { id: 'propertyBoundary', label: 'Property boundary', defaultVisible: true },
  { id: 'buildingFootprint', label: 'Building footprint', defaultVisible: true },
  { id: 'defenseZones', label: 'Defense zones', defaultVisible: true },
  { id: 'riskMarkers', label: 'Risk markers', defaultVisible: true },
  {
    id: 'lowVegetation',
    label: 'Low vegetation (placeholder)',
    defaultVisible: false,
    description: 'Reserved layer for future model-assisted low vegetation classification.',
  },
  {
    id: 'shrubs',
    label: 'Shrubs (placeholder)',
    defaultVisible: false,
    description: 'Reserved layer for future shrub segmentation overlays.',
  },
  {
    id: 'trees',
    label: 'Trees (placeholder)',
    defaultVisible: false,
    description: 'Reserved layer for future tree inventory/health data.',
  },
  {
    id: 'hardSurface',
    label: 'Hard surface (placeholder)',
    defaultVisible: false,
    description: 'Reserved layer for future non-combustible hardscape extraction.',
  },
];

export const defaultLayerVisibility = layerRegistry.reduce<Record<string, boolean>>(
  (acc, layer) => {
    acc[layer.id] = layer.defaultVisible;
    return acc;
  },
  {},
);
