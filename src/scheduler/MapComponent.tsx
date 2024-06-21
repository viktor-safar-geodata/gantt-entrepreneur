import MapView from '@arcgis/core/views/MapView.js';
import Map from '@arcgis/core/Map.js';
import React from 'react';
import Graphic from '@arcgis/core/Graphic.js';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js';

export interface IMapComponentProps {
  map: Map;
  features: Graphic[];
}

export type MapComponentRef = {
  goToFeature: (objectId: number) => void;
};

const MapComponent = React.forwardRef<MapComponentRef, IMapComponentProps>((props, ref) => {
  const mapDiv = React.useRef(null);
  const mapViewRef = React.useRef<MapView | null>(null);
  const layerViewRef = React.useRef<__esri.FeatureLayerView>();
  const highlightHandleRef = React.useRef<__esri.Handle>();

  React.useImperativeHandle(
    ref,
    (): MapComponentRef => ({
      goToFeature(objectId: number) {
        const feature = props.features.find((f) => f.attributes['objectid'] === objectId);
        const extentOrGeometry = feature!.geometry.extent || feature!.geometry;

        if (!mapViewRef.current?.extent.contains(extentOrGeometry)) {
          mapViewRef.current!.goTo({
            target: extentOrGeometry,
          });
        }

        highlightHandleRef.current?.remove();
        highlightHandleRef.current = layerViewRef.current?.highlight(objectId);
      },
    })
  );

  React.useEffect(() => {
    const view = new MapView({
      container: mapDiv.current!,
      map: props.map,
      zoom: 4,
      center: [6, 59],
    });

    view.when(() => {
      mapViewRef.current = view;

      const layer = props.map.findLayerById('basrapport') as __esri.FeatureLayer;
      view.whenLayerView(layer).then((layerView) => {
        layerViewRef.current = layerView;
      });

      const combinedExtent = geometryEngine.union(props.features.map((feature) => feature.geometry));
      view.goTo(combinedExtent);
    });
  }, []);

  return <div ref={mapDiv} style={{ height: '100%', width: '100%' }} />;
});

export default MapComponent;
