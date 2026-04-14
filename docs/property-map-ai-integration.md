# ZionDome V1 Property Map: AI/Data Integration Notes

This scaffold introduces a modular layer-driven map screen at `app/property-map/page.tsx`.

## Where to plug in future outputs

- **Property + structure geometries**
  - Replace `mockPropertyMapData.propertyBoundary` and `mockPropertyMapData.buildingFootprint` with API-provided GeoJSON.
  - File: `src/features/property-map/data/mockPropertyData.ts`

- **Risk marker outputs**
  - Replace `mockPropertyMapData.riskMarkers` with model/API generated risk findings.
  - Required marker fields already scaffolded:
    - `riskType`
    - `severity`
    - `zone`
    - `recommendedAction`
    - `status`

- **Defense zone generation**
  - The utility in `src/features/property-map/utils/generateDefenseZones.ts` computes Zone 1/2/3 from the building footprint using Turf buffers.
  - Can be swapped with server-side geometry generation while preserving layer contracts.

- **Future raster overlays and classification layers**
  - Existing layer registry includes placeholders for low vegetation, shrubs, trees, and hard surface.
  - File: `src/features/property-map/config/layerRegistry.ts`

## Why this structure

- Layer state is centralized and toggle-driven for easy expansion.
- Map rendering code is isolated in `PropertyMapView` for maintainability.
- Data contracts are typed in `src/features/property-map/types/index.ts` to keep API integrations explicit.
