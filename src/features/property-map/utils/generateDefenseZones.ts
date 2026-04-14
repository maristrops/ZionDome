import type { Feature, FeatureCollection, Polygon } from 'geojson';
import { buffer, difference, featureCollection } from '@turf/turf';

import type { DefenseZoneFeature } from '../types';

const ZONE_DISTANCES_IN_METERS = [10, 20, 30] as const;

export function generateDefenseZones(
  buildingFootprint: Feature<Polygon>,
): FeatureCollection<DefenseZoneFeature['geometry'], DefenseZoneFeature['properties']> {
  const [z1Distance, z2Distance, z3Distance] = ZONE_DISTANCES_IN_METERS;

  const zone1Buffer = buffer(buildingFootprint, z1Distance, { units: 'meters' });
  const zone2Buffer = buffer(buildingFootprint, z2Distance, { units: 'meters' });
  const zone3Buffer = buffer(buildingFootprint, z3Distance, { units: 'meters' });

  const zone2Ring = difference(zone2Buffer, zone1Buffer);
  const zone3Ring = difference(zone3Buffer, zone2Buffer);

  const zones: DefenseZoneFeature[] = [
    {
      type: 'Feature',
      properties: { zone: 'Zone 1' },
      geometry: zone1Buffer.geometry,
    },
  ];

  if (zone2Ring) {
    zones.push({
      type: 'Feature',
      properties: { zone: 'Zone 2' },
      geometry: zone2Ring.geometry,
    });
  }

  if (zone3Ring) {
    zones.push({
      type: 'Feature',
      properties: { zone: 'Zone 3' },
      geometry: zone3Ring.geometry,
    });
  }

  return featureCollection(zones);
}
