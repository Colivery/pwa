import { injectable } from "springtype/core/di";

@injectable
export class GeoService {

    mapBoxToken: string = 'pk.eyJ1IjoiY29saXZlcnkiLCJhIjoiY2s4MmJ2bGRvMDM1dTNkbzBsNDc2OWJ6bSJ9.ERHVr0UICGhylU-Y16i9NQ';

    // https://docs.mapbox.com/api/search/#forward-geocoding
    async forwardGeoCode(searchText: string) {
        const response = await fetch(`https://nominatim.openstreetmap.org/search/${searchText}?format=jsonv2`);
        return await response.json();
    }

    async forwardLocalPlacesSearch(searchText: string, distanceInMeters: number = 20000) {

        const currentPosition = await this.getCurrentLocation();
        const bbox = this.getBBoxWithDistance(currentPosition.latitude, currentPosition.longitude, distanceInMeters);
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=%2F*%0AThis%20has%20been%20generated%20by%20the%20overpass-turbo%20wizard.%0AThe%20original%20search%20was%3A%0A%E2%80%9Cshop%3Dbicycle%E2%80%9D%0A*%2F%0A%5Bout%3Ajson%5D%5Btimeout%3A25%5D%3B%0A%28%0A%20%20relation%5B%22amenity%22%3D%22cafe%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22amenity%22%3D%22cafe%22%5D%5B~%22%5Ename%22~%22${searchText}%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22amenity%22%3D%22cafe%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22amenity%22%3D%22pharmacy%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22amenity%22%3D%22pharmacy%22%5D%5B~%22%5Ename%22~%22${searchText}%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22amenity%22%3D%22pharmacy%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22supermarket%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22supermarket%22%5D%5B~%22%5Ename%22~%22${searchText}%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22supermarket%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22butcher%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22butcher%22%5D%5B~%22%5Ename%22~%22${searchText}%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22butcher%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22beverages%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22beverages%22%5D%5B~%22%5Ename%22~%22${searchText}%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22beverages%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20node%5B%22shop%22%3D%22bakery%22%5D%5B~%22%5Ename%22~%22${searchText}%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20way%5B%22shop%22%3D%22bakery%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%20%20relation%5B%22shop%22%3D%22bakery%22%5D%28${bbox.latMin}%2C${bbox.longMin}%2C${bbox.latMax}%2C${bbox.longMax}%29%3B%0A%29%3B%0Aout%20body%3B%0A%3E%3B%0Aout%20skel%20qt%3B`);

        const responseJSON = await response.json();

        const filteredElements = responseJSON.elements.filter((element) => {
            return element.tags && element.tags['addr:street'] && element.tags['addr:postcode'] &&
                element.tags.name && element.tags.name.indexOf(searchText) > -1;
        });
        return filteredElements;
    }

    async getCurrentLocation(): Promise<Coordinates> {
        return new Promise((resolve: Function, reject: Function) => {
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
    }

    toRad(n: number): number {
        return n * Math.PI / 180;
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