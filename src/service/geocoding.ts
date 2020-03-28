import {injectable} from "springtype/core/di";
import {Shop} from "../datamodel/shop";
import {st} from "springtype/core";
import Geohash from 'latlon-geohash';

@injectable
export class GeoService {

    // cache
    currentLocation: Coordinates;

    // https://docs.mapbox.com/api/search/#forward-geocoding
    async forwardGeoCode(searchText: string) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search/${searchText}?format=jsonv2`);
        return await response.json();
    }

    async forwardLocalPlacesSearch(searchText: string, distanceInMeters: number = 20000): Promise<Array<Shop>> {

        const currentPosition = await this.getCurrentLocation();
        const bbox = this.getBBoxWithDistance(currentPosition.latitude, currentPosition.longitude, distanceInMeters);
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Cshop%3Dbicycle%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%28%0A%20%20relation%5B%22amenity%22%3D%22cafe%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22amenity%22%3D%22cafe%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22amenity%22%3D%22cafe%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22amenity%22%3D%22pharmacy%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22amenity%22%3D%22pharmacy%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22amenity%22%3D%22pharmacy%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22supermarket%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22supermarket%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22supermarket%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22butcher%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22butcher%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22butcher%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22beverages%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22beverages%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22beverages%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22bakery%22%5D%5B~%22%5Ename%22~%22${searchText}%22,i%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22bakery%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22bakery%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%29%3B%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B`);
        const responseJSON = await response.json();

        const nodes: { [id: string]: { lat: number; lon: number } } = {};
        const ways: Array<Shop> = [];

        for (const el of responseJSON.elements) {
            if (el.type === 'node') {
                nodes[el.id] = {lat: el.lat, lon: el.lon};
            }
        }

        for (const el of responseJSON.elements) {
            if (el.type === 'way'
                && el.tags && el.tags['addr:street'] && el.tags['addr:housenumber'] && el.tags['addr:postcode']
                && el.tags.shop
                && el.tags.name && el.tags.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                && ((!!el.nodes && Array.isArray(el.nodes)) || (el.lat && el.lon))
            ) {
                let locationNode;
                if (!!el.nodes && Array.isArray(el.nodes) && el.nodes.length > 0 && !!nodes[el.nodes[0]]) {
                    locationNode = nodes[el.nodes[0]];
                } else {
                    locationNode = {lat: el.lat, lon: el.lon};
                }

                ways.push({
                    ...locationNode,
                    id: el.id,
                    city: el.tags['addr:city'] || '',
                    houseNumber: el.tags['addr:housenumber'],
                    postcode: el.tags['addr:postcode'],
                    name: el.tags.name,
                    shop: el.tags.shop ,
                    street: el.tags['addr:street']
                })
            }
        }

        st.debug(ways);
        return ways;
    }

    async getCurrentLocation(): Promise<Coordinates> {
        if (this.currentLocation) {
            return this.currentLocation;
        }
        this.currentLocation = await new Promise((resolve: Function, reject: Function) => {
            navigator.geolocation.getCurrentPosition((pos) => {
                resolve(pos.coords);
            }, (err) => {
                reject(err);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        });

        return this.currentLocation;
    }

    toRad(n: number): number {
        return n * Math.PI / 180;
    }

    getGeoHash(lat: number, lon: number, precision: number) {
        return Geohash.encode(lat, lon, precision);
    }

    getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
        const radLat1 = Math.PI * lat1 / 180;
        const radLat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = this.toRad(dist);
        dist = dist * 60 * 1.1515;
        return dist * 1.609344
    }

    getBBoxWithDistance(lat: number, lon: number, distanceMeters: number) {

        const latRadian = this.toRad(lat);

        const degLatKm = 110.574235;
        const degLongKm = 110.572833 * Math.cos(latRadian);
        const deltaLat = distanceMeters / 1000.0 / degLatKm;
        const deltaLong = distanceMeters / 1000.0 / degLongKm;

        const topLat = lat + deltaLat;
        const bottomLat = lat - deltaLat;
        const leftLng = lon - deltaLong;
        const rightLng = lon + deltaLong;

        // const northWestCoords = topLat + ',' + leftLng;
        // const northEastCoords = topLat + ',' + rightLng;
        // const southWestCoords = bottomLat + ',' + leftLng;
        // const southEastCoords = bottomLat + ',' + rightLng;
        // const boundingBox = [northWestCoords, northEastCoords, southWestCoords, southEastCoords];
        return {
            latMin: bottomLat,
            longMin: leftLng,
            latMax: topLat,
            longMax: rightLng
        };
    }
}