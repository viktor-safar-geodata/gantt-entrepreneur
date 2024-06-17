import MapView from '@arcgis/core/views/MapView.js';
import Map from '@arcgis/core/Map.js';
import React from 'react';
import Graphic from '@arcgis/core/Graphic.js';

import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js';

export interface IMapComponentProps {
  map: Map;
  features: Graphic[];
  setMapView: (mapView: MapView) => void;
}

export default function MapComponent(props: IMapComponentProps) {
  const mapDiv = React.useRef(null);

  React.useEffect(() => {
    const view = new MapView({
      container: mapDiv.current!,
      map: props.map,
      zoom: 4,
      center: [6, 59],
    });

    view.when(() => {
      props.setMapView(view);

      const combinedExtent = geometryEngine.union(props.features.map((feature) => feature.geometry));
      view.goTo(combinedExtent);
    });
  }, []);

  return <div ref={mapDiv} style={{ height: '100%', width: '100%' }} />;
}
