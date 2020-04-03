import { component, attr } from "springtype/web/component";
import { st } from "springtype/core";
import { getUniqueHTMLId } from "../../function/get-unique-html-id";
import { tsx } from "springtype/web/vdom";


/**
 * Expects in <head>:
 * 
 * <link rel="stylesheet" href="https://js.arcgis.com/4.14/esri/themes/light/main.css">
 * <script src="https://js.arcgis.com/4.14/"></script>
 */
export interface EsriMapProps {
    height?: number;
    latitude?: number;
    longitude?: number;
    unit?: 'metric' | 'non-metric' | 'dual';
    uiComponents?: Array<'attribution' | 'zoom'>;
    showScaleBar?: boolean;
    zoomLevel?: number;
}

@component
export class EsriMap extends st.component<EsriMapProps> {

    tag: 'div';

    @attr
    latitude: number = 0;

    @attr
    height: number = 250;

    @attr
    longitude: number = 0;

    @attr
    unit: 'metric' | 'non-metric' | 'dual' = 'metric';

    @attr
    showScaleBar: boolean = true;

    @attr
    zoomLevel: number = 13;
    
    @attr
    uiComponents: Array<'attribution' | 'zoom'> = ['attribution', 'zoom'];

    webMap: any;

    scaleBar: any;

    mapView: any;

    ersiMapId: string;

    markers: Array<any> = [];

    style = { width: '100%', height: '100%' };

    constructor() {
        super();
        this.ersiMapId = getUniqueHTMLId();
    }

    async init() {

        if (this.webMap) {
            return Promise.resolve();
        }

        return new Promise((resolve: Function) => {

            (window as any).require([
                "esri/Map",
                "esri/views/MapView",
                "esri/widgets/ScaleBar"
            ], (Map: any, MapView: any, ScaleBar: any) => {

                this.webMap = new Map({
                    basemap: "topo-vector"
                });

                this.mapView = new MapView({
                    container: this.ersiMapId,
                    map: this.webMap,
                    center: [this.longitude, this.latitude],
                    zoom: 13,
                    ui: {
                        components: ["attribution"]
                    }
                });

                this.scaleBar = new ScaleBar({
                    unit: this.unit,
                    view: this.mapView
                });

                if (this.showScaleBar) {
                    this.mapView.ui.add(this.scaleBar, {
                        position: "bottom-right"
                    });
                }

                resolve();
            });
        });
    }

    async setCenter(lat: number, lon: number) {
        await this.init();
        this.mapView.center = [lon, lat];
    }

    async addMarker(lat: number, lon: number, imgSrc: string, imgWidth: number, imgHeight: number) {

        return new Promise(async (resolve: Function) => {

            await this.init();

            (window as any).require([
                "esri/Graphic"
            ], (Graphic: any) => {

                let pointGraphic = new Graphic({
                    geometry: {
                        type: "point",
                        longitude: lon,
                        latitude: lat
                    },
                    symbol: {
                        type: "picture-marker",
                        url: imgSrc,
                        width: imgWidth,
                        height: imgHeight
                    }
                });

                this.mapView.graphics.add(pointGraphic);

                this.markers.push(pointGraphic);

                resolve(pointGraphic);
            });
        });
    }

    async removeAllMarkers() {
        for (const marker of this.markers) {
            await this.removeMarker(marker);
        }
    }

    async removeMarker(marker: any) {
        await this.init();
        this.mapView.graphics.remove(marker);
    }

    render() {
        return <div id={this.ersiMapId} style={{ width: '100%', height: this.height + 'px' }} />
    }
}