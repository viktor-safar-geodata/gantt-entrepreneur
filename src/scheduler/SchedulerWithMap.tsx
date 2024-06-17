import * as React from 'react';
import SchedulerComponent from './SchedulerComponent';
import MapComponent from './MapComponent';
import MapView from '@arcgis/core/views/MapView.js';
import Map from '@arcgis/core/Map.js';
import { SchedulerData } from './models';
import './SchedulerWithMap.css';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import { EventModel, ResourceModel } from '@bryntum/scheduler';
import Graphic from '@arcgis/core/Graphic.js';

export interface ISchedulerWithMapProps {}

export function SchedulerWithMap(props: ISchedulerWithMapProps) {
  const mapViewRef = React.useRef<MapView | null>(null);
  const featuresRef = React.useRef<Graphic[]>([]);
  const mapRef = React.useRef<__esri.Map>();
  const layerViewRef = React.useRef<__esri.FeatureLayerView>();
  const highlightRef = React.useRef<__esri.Handle>();
  const [startDate, setStartDate] = React.useState<Date>(new Date(2024, 0, 1));
  const [endDate, setEndDate] = React.useState<Date>(new Date(2024, 0, 7));

  const [schedulerData, setSchedulerData] = React.useState<SchedulerData>();

  const handleSetMapView = (mapView: MapView): void => {
    mapViewRef.current = mapView;
  };

  const handleSetLayerView = (layerView: __esri.FeatureLayerView): void => {
    layerViewRef.current = layerView;
  };

  const handleSchedulerHasChanges = (bryntumEvent: any) => {
    console.log('handleSchedulerHasChanges', bryntumEvent);
  };

  const listeners = {
    hasChanges: handleSchedulerHasChanges,
  };

  React.useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new Map({
      basemap: 'streets-navigation-vector',
    });

    mapRef.current.add(
      new FeatureLayer({
        url: 'https://veidekke.cloudgis.no/enterprise/rest/services/Hosted/Basrapport/FeatureServer/0',
        id: 'basrapport',
      })
    );

    const layer = mapRef.current.findLayerById('basrapport') as FeatureLayer;
    const query = layer.createQuery();
    query.where = "fra_klokken > '2024-01-01' and til_klokken < '2024-01-14'";

    const groupFieldName = 'løp';

    layer.queryFeatures(query).then((result) => {
      featuresRef.current = result.features;

      const uniqueResources = new Set<string>();
      const events: EventModel[] = [];
      result.features.forEach((feature) => {
        if (feature.attributes['fra_klokken'] > feature.attributes['til_klokken']) return;

        uniqueResources.add(feature.attributes[groupFieldName]);
        events.push({
          id: feature.attributes['objectid'],
          resourceId: feature.attributes[groupFieldName],
          startDate: new Date(feature.attributes['fra_klokken']),
          endDate: new Date(feature.attributes['til_klokken']),
          name: feature.attributes['aktivitiet'],
        } as EventModel);
      });

      const resources: ResourceModel[] = [];
      for (const r of uniqueResources) {
        resources.push({
          id: r,
          name: r,
        } as ResourceModel);
      }

      setStartDate(() => {
        const result = events.reduce((min, p) => (p.startDate < min ? p.startDate : min), events[0].startDate);
        return new Date(result);
      });

      setEndDate(() => {
        const result = events.reduce((max, p) => (p.endDate > max ? p.endDate : max), events[0].endDate);
        return new Date(result);
      });

      setSchedulerData({
        resources,
        events,
      });
    });
  }, []);

  const onEventSelectedHandler = (eventObjectId: number) => {
    highlightRef.current?.remove();
    const feature = featuresRef.current.find((f) => f.attributes['objectid'] === eventObjectId);
    const extentOrGeometry = feature!.geometry.extent || feature!.geometry;

    if (!mapViewRef.current?.extent.contains(extentOrGeometry)) {
      mapViewRef.current!.goTo({
        target: extentOrGeometry,
      });
    }

    highlightRef.current = layerViewRef.current!.highlight(eventObjectId);
  };
  return (
    <div className="geodata-scheduler-with-map-container">
      {schedulerData && (
        <>
          <SchedulerComponent
            schedulerData={schedulerData}
            onEventSelected={onEventSelectedHandler}
            startDate={startDate}
            endDate={endDate}
            listeners={listeners}
          />
          <MapComponent
            map={mapRef.current!}
            features={featuresRef.current}
            setMapView={handleSetMapView}
            setLayerView={handleSetLayerView}
          />
        </>
      )}
      {!schedulerData && <div className="loading-div">Loading...</div>}
    </div>
  );
}
