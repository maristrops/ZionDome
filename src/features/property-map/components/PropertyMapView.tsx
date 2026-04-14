'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { FeatureCollection, Point, Polygon } from 'geojson';

import { layerRegistry, defaultLayerVisibility } from '../config/layerRegistry';
import { mockPropertyMapData } from '../data/mockPropertyData';
import { generateDefenseZones } from '../utils/generateDefenseZones';
import { LayerPanel } from './LayerPanel';

const ORTHOPHOTO_SOURCE_ID = 'orthophoto-source';

export function PropertyMapView() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const riskMarkersRef = useRef<maplibregl.Marker[]>([]);
  const [layerVisibility, setLayerVisibility] = useState(defaultLayerVisibility);

  const defenseZones = useMemo(
    () => generateDefenseZones(mockPropertyMapData.buildingFootprint as GeoJSON.Feature<Polygon>),
    [],
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {},
        layers: [
          {
            id: 'base-background',
            type: 'background',
            paint: { 'background-color': '#e5e7eb' },
          },
        ],
      },
      center: mockPropertyMapData.center as [number, number],
      zoom: 17,
      pitch: 0,
      attributionControl: true,
    });

    mapRef.current = map;

    map.on('load', () => {
      map.addSource(ORTHOPHOTO_SOURCE_ID, {
        type: 'raster',
        tiles: ['https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
        tileSize: 256,
        attribution: 'Esri World Imagery',
      });

      map.addLayer({
        id: 'orthophoto-layer',
        type: 'raster',
        source: ORTHOPHOTO_SOURCE_ID,
      });

      map.addSource('property-boundary-source', {
        type: 'geojson',
        data: mockPropertyMapData.propertyBoundary,
      });

      map.addLayer({
        id: 'property-boundary-line-layer',
        type: 'line',
        source: 'property-boundary-source',
        paint: {
          'line-color': '#0f172a',
          'line-width': 3,
        },
      });

      map.addSource('building-footprint-source', {
        type: 'geojson',
        data: mockPropertyMapData.buildingFootprint,
      });

      map.addLayer({
        id: 'building-footprint-fill-layer',
        type: 'fill',
        source: 'building-footprint-source',
        paint: {
          'fill-color': '#2563eb',
          'fill-opacity': 0.35,
        },
      });

      map.addLayer({
        id: 'building-footprint-line-layer',
        type: 'line',
        source: 'building-footprint-source',
        paint: {
          'line-color': '#1d4ed8',
          'line-width': 2,
        },
      });

      map.addSource('defense-zones-source', {
        type: 'geojson',
        data: defenseZones,
      });

      map.addLayer({
        id: 'defense-zones-fill-layer',
        type: 'fill',
        source: 'defense-zones-source',
        paint: {
          'fill-color': [
            'match',
            ['get', 'zone'],
            'Zone 1',
            '#f97316',
            'Zone 2',
            '#facc15',
            'Zone 3',
            '#22c55e',
            '#9ca3af',
          ],
          'fill-opacity': 0.2,
        },
      });

      map.addLayer({
        id: 'defense-zones-line-layer',
        type: 'line',
        source: 'defense-zones-source',
        paint: {
          'line-color': '#334155',
          'line-width': 1.5,
        },
      });

      riskMarkersRef.current = renderRiskMarkers(map, mockPropertyMapData.riskMarkers);
      applyVisibility(map, layerVisibility, riskMarkersRef.current);
    });

    return () => {
      riskMarkersRef.current.forEach((marker) => marker.remove());
      riskMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [defenseZones]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    applyVisibility(mapRef.current, layerVisibility, riskMarkersRef.current);
  }, [layerVisibility]);

  const onToggleLayer = (layerId: string) => {
    setLayerVisibility((prev) => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  return (
    <section style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <LayerPanel layers={layerRegistry} visibility={layerVisibility} onToggleLayer={onToggleLayer} />
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />
      </div>
    </section>
  );
}

function renderRiskMarkers(
  map: maplibregl.Map,
  riskMarkers: FeatureCollection<Point>,
) {
  const markers: maplibregl.Marker[] = [];

  for (const feature of riskMarkers.features) {
    const markerEl = document.createElement('button');
    markerEl.type = 'button';
    markerEl.style.width = '14px';
    markerEl.style.height = '14px';
    markerEl.style.borderRadius = '999px';
    markerEl.style.border = '2px solid white';
    markerEl.style.backgroundColor = '#dc2626';
    markerEl.style.boxShadow = '0 2px 6px rgba(0,0,0,0.35)';
    markerEl.title = `${feature.properties?.riskType ?? 'Risk'} (${feature.properties?.severity ?? 'unknown'})`;

    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
      <strong>${feature.properties?.riskType ?? 'Risk marker'}</strong><br/>
      Severity: ${feature.properties?.severity ?? 'unknown'}<br/>
      Zone: ${feature.properties?.zone ?? 'n/a'}<br/>
      Action: ${feature.properties?.recommendedAction ?? 'n/a'}<br/>
      Status: ${feature.properties?.status ?? 'n/a'}
    `;

    const marker = new maplibregl.Marker({ element: markerEl })
      .setLngLat(feature.geometry.coordinates as [number, number])
      .setPopup(new maplibregl.Popup({ offset: 16 }).setDOMContent(popupContent))
      .addTo(map);

    markers.push(marker);
  }

  return markers;
}

function applyVisibility(
  map: maplibregl.Map,
  visibility: Record<string, boolean>,
  riskMarkers: maplibregl.Marker[],
) {
  const layerMap: Record<string, string[]> = {
    orthophoto: ['orthophoto-layer'],
    propertyBoundary: ['property-boundary-line-layer'],
    buildingFootprint: ['building-footprint-fill-layer', 'building-footprint-line-layer'],
    defenseZones: ['defense-zones-fill-layer', 'defense-zones-line-layer'],
  };

  for (const [logicalLayerId, mapLayerIds] of Object.entries(layerMap)) {
    for (const mapLayerId of mapLayerIds) {
      if (map.getLayer(mapLayerId)) {
        map.setLayoutProperty(
          mapLayerId,
          'visibility',
          visibility[logicalLayerId] ? 'visible' : 'none',
        );
      }
    }
  }

  const markerDisplay = visibility.riskMarkers ? 'block' : 'none';
  riskMarkers.forEach((marker) => {
    marker.getElement().style.display = markerDisplay;
  });
}
