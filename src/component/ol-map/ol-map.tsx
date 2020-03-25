import "ol/ol.css"
import {st} from "springtype/core";
import {IEvent, IEventListener, ILifecycle} from "springtype/web/component/interface";
import {attr, component, event} from "springtype/web/component";
import {tsx} from "springtype/web/vdom";

import {Feature, Map, MapBrowserPointerEvent, View} from "ol";
import {Coordinate} from "ol/coordinate";
import {fromLonLat, transform} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import {TileImage} from "ol/source";
import {ref} from "springtype/core/ref";
import {defaults} from "ol/control";
import {Vector} from "ol/layer";
import {Icon, Style} from "ol/style";
import {Point} from "ol/geom";
import VectorSource from "ol/source/Vector";


export interface OlMapClickEvent extends IEvent<OlMapClickDetail> {
}

export interface OlMapClickDetail {
    longitude: number;
    latitude: number;
}

export interface IAttrOlMap {
    latitude?: number;
    longitude?: number;
    height?: number;
    hideZoom?: boolean;
    onOlMapClick?: (evt: OlMapClickEvent) => void
}

@component({tag: 'div'})
export class OlMap extends st.component<IAttrOlMap> implements ILifecycle {

    @attr
    latitude: number = 0;

    @attr
    height: number = 250;
    @attr
    longitude: number = 0;

    @attr
    hideZoom: boolean = false;

    @attr
    splash: boolean = false;

    @event
    onOlMapClick!: IEventListener<Event>;

    dispatchOlMapClick = (detail: OlMapClickDetail) => {
        this.dispatchEvent<OlMapClickDetail>("olMapClick", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                ...detail,
            },
        });
    };

    @ref
    mapRef: HTMLDivElement;

    olMap!: Map;

    view!: View;

    markerLayer: Vector;


    render() {
        return <div style={`height: ${this.height}px;`} novdom>
            {this.splash ? <div class="ol-splash" ref={{overlayRef: this}}/> : <fragment/>}
            <div ref={{mapRef: this}} class={['map', 'ol-map']} style={`height: ${this.height}px;`}/>
        </div>;
    }

    init(): void {

        if (!this.olMap) {

            const language = 'de';
            const country = 'DE';

            const olLayer = new TileLayer({
                visible: true,
                preload: Infinity,
                source: new TileImage({
                    wrapX: true,
                    url: `http://maps.google.de/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i375060738!3m9!2s${language}!3s${country.toUpperCase()}!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0`
                })
            });

            this.markerLayer = new Vector({
                source: new VectorSource({
                    features: []
                }),
                style: new Style({
                    image: new Icon({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        src: require('../../../assets/images/map_marker.png')
                    })
                })
            });
            this.view = new View({
                center: fromLonLat([this.longitude, this.latitude]),
                zoom: 15,
            });

            this.olMap = new Map({
                target: this.mapRef,
                layers: [olLayer, this.markerLayer],
                view: this.view,
                controls: defaults({
                    zoom: !this.hideZoom,
                }),

            });

            this.addListeners();

        }
    }


    addListeners() {
        this.olMap.on('click', (evt: MapBrowserPointerEvent) => {
            const coordinate = this.transformToGps(evt.coordinate);
            this.dispatchOlMapClick({latitude: coordinate[1], longitude: coordinate[0]});
        });
    }


    transformToGps(coordinate: Coordinate): Array<number> {
        return transform([coordinate[0], coordinate[1]], 'EPSG:3857', 'EPSG:4326');
    }

    setCenter(latitude: number, longitude: number) {
        this.view.setCenter(fromLonLat([longitude, latitude]))
    }


    setMarker(lat: number, lng: number) {
        const newMarker = new Feature({
            geometry: new Point(fromLonLat([lng, lat])),
        });

        this.markerLayer.getSource().addFeature(newMarker);

        return newMarker;
    }

    removeAllMarker() {
        this.markerLayer.getSource().getFeatures().forEach(feature => this.markerLayer.getSource().removeFeature(feature));
    }


    removeMarker(marker: Feature) {
        if (marker) {
            try {
                this.markerLayer.getSource().removeFeature(marker);
            } catch (e) {
            }
        }
    }
}

