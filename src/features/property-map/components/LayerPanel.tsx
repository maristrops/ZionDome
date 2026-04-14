'use client';

import type { LayerConfig } from '../types';

interface LayerPanelProps {
  layers: LayerConfig[];
  visibility: Record<string, boolean>;
  onToggleLayer: (layerId: string) => void;
}

export function LayerPanel({ layers, visibility, onToggleLayer }: LayerPanelProps) {
  return (
    <aside
      style={{
        width: 320,
        padding: 16,
        borderRight: '1px solid #d4d4d8',
        background: '#ffffff',
        overflowY: 'auto',
      }}
    >
      <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Layers</h2>
      <p style={{ margin: '0 0 16px', color: '#52525b', fontSize: 13 }}>
        Toggle map overlays for the ZionDome V1 property defense workspace.
      </p>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
        {layers.map((layer) => (
          <li key={layer.id}>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(visibility[layer.id])}
                onChange={() => onToggleLayer(layer.id)}
                style={{ marginTop: 2 }}
              />
              <span>
                <span style={{ display: 'block', fontWeight: 600, fontSize: 14 }}>{layer.label}</span>
                {layer.description ? (
                  <span style={{ display: 'block', color: '#71717a', fontSize: 12 }}>{layer.description}</span>
                ) : null}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
}
