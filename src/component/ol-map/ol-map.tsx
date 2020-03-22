import "ol/ol.css"
import {st} from "springtype/core";
import {IEvent, IEventListener, ILifecycle} from "springtype/web/component/interface";
import {attr, component, event} from "springtype/web/component";
import {tsx} from "springtype/web/vdom";

import {Map, MapBrowserPointerEvent, View} from "ol";
import {Coordinate} from "ol/coordinate";
import {transform} from "ol/proj";
import TileLayer from "ol/layer/Tile";
import {TileImage} from "ol/source";
import {ref} from "springtype/core/ref";
import {defaults} from "ol/control";


export interface OlMapClickEvent extends IEvent<OlMapClickDetail> {
}

export interface OlMapClickDetail {
    longitude: number;
    latitude: number;
}

export interface IAttrOlMap {
    latitude: number;
    longitude: number;
    height?: number;
    hideZoom?: boolean;
    onOlMapClick: (evt: OlMapClickEvent) => void
}

@component
export class OlMap extends st.component<IAttrOlMap> implements ILifecycle {

    @attr
    latitude: number = 0;

    @attr
    longitude: number = 0;

    @attr
    hideZoom: boolean = false;

    @attr
    splash: boolean = false;

    @attr
    height: number = 250;

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


    render() {
        return <div style={{height: `${this.height}px`}}>
            {this.splash ? <div class="ol-splash" ref={{overlayRef: this}}/> : <fragment/>}
            <div ref={{mapRef: this}} class={['map', 'ol-map']}/>
        </div>;
    }

    onAfterRender(): void {

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

        this.view = new View({
            center: this.transformToOl([this.longitude, this.latitude]),
            zoom: 15,
        });

        this.olMap = new Map({
            target: this.mapRef,
            layers: [olLayer],
            view: this.view,
            controls: defaults({
                zoom: !this.hideZoom,
            }),

        });

        this.addListeners();

    }


    addListeners() {
        this.olMap.on('click', (evt: MapBrowserPointerEvent) => {
            const coordinate = this.transformToGps(evt.coordinate);
            this.dispatchOlMapClick({latitude: coordinate[1], longitude: coordinate[0]});
        });
    }

    transformToOl(coordinate: Coordinate): Array<number> {
        return transform(coordinate, 'EPSG:4326', 'EPSG:3857');
    };

    transformToGps(coordinate: Coordinate): Array<number> {
        return transform([coordinate[0], coordinate[1]], 'EPSG:3857', 'EPSG:4326');
    }

    setCenter(latitude: number, longitude: number) {
        this.view.setCenter(this.transformToOl([longitude, latitude]))
    }

    setLatitude(latitude: number) {
        const lonLat = this.view.getCenter();
        this.view.setCenter([lonLat[0], this.transformToOl([0, latitude])[1]])
    }

    setLongitude(longitude: number) {
        const lonLat = this.view.getCenter();
        this.view.setCenter([this.transformToOl([longitude, 0])[0], lonLat[1]])
    }
}

