import {component} from "springtype/web/component";
import {st} from "springtype/core";
import {IElement} from "springtype/web/vdom/interface";
import {loadModules, setDefaultOptions} from "esri-loader";
import {getUniqueHTMLId} from "../../function/get-unique-html-id";
import {tsx} from "springtype/web/vdom";

@component({tag: 'div'})
export class EsriMap extends st.component {

    webMap: any;

    mapView: any;

    ersiMapId: string;
    style = {width: '100%', height: '100%'};

    constructor() {
        super();
        this.ersiMapId = getUniqueHTMLId();
    }

    onAfterElCreate(el: IElement): void {
        super.onAfterElCreate(el);
        const attributes = this.virtualNode.attributes;
        attributes['novdom'] = '';
        this.virtualNode.attributes = attributes
    }

    async onAfterInitialRender() {
        await setDefaultOptions({css: true});

        const [MapView, WebMap, VectorTileLayer] = await loadModules(['esri/views/MapView', 'esri/WebMap', 'esri/layers/VectorTileLayer']);

        // then we load a web map from an id
        this.webMap = new WebMap({
                basemap: "topo-vector"
        });
        // and we show that map in a container w/ id #viewDiv
        this.mapView = new MapView({
            map: this.webMap,
            container: this.ersiMapId,
            center: [-118.80500, 34.02700],
            zoom: 13
        });
    }


    render() {
        return <div id={this.ersiMapId} style={{width: '100%', height: '100%'}}/>
    }
}