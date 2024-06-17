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

  const [schedulerData, setSchedulerData] = React.useState<SchedulerData>();

  function handleSetMapView(mapView: MapView): void {
    mapViewRef.current = mapView;
  }

  React.useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new Map({
      basemap: 'streets-navigation-vector',
    });

    mapRef.current.add(
      new FeatureLayer({
        url: 'https://veidekke.cloudgis.no/enterprise/rest/services/Hosted/Basrapport/FeatureServer/0',
        id: 'basrapport',
        apiKey: '',
        // https://veidekke.cloudgis.no/enterprise/sharing/rest/generateToken
      })
    );

    const layer = mapRef.current.findLayerById('basrapport') as FeatureLayer;
    const query = layer.createQuery();
    query.where = "fra_klokken > '2024-01-01' and til_klokken < '2024-01-07'";
    layer.queryFeatures(query).then((result) => {
      console.log(result.features);
      featuresRef.current = result.features;

      const uniqueResources = new Set<string>();
      const events: EventModel[] = [];
      result.features.forEach((feature) => {
        uniqueResources.add(feature.attributes['skift']);
        events.push({
          id: feature.attributes['objectid'],
          resourceId: feature.attributes['skift'],
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

      console.log('resources', resources);
      console.log('events', events);

      setSchedulerData({
        resources,
        events,
      });
    });
  }, []);

  return (
    <div className="geodata-scheduler-with-map-container">
      {schedulerData && (
        <>
          <SchedulerComponent schedulerData={schedulerData} />
          <MapComponent map={mapRef.current!} features={featuresRef.current} setMapView={handleSetMapView} />
        </>
      )}
      {!schedulerData && <div className="loading-div">Loading...</div>}
    </div>
  );
}
