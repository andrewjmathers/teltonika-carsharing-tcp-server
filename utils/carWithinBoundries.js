const inside = require('point-in-polygon-hao');

const wrapPolygon = (polygon) => [polygon];

const isCarInBoundries = (car, boundries) => {
    const polygonCoordinates = boundries?.geometry?.coordinates;
    const carLocation = [car.Longitude, car.Latitude]
    const carIsInsideShape = inside(carLocation, wrapPolygon(polygonCoordinates[0]));
    if(carIsInsideShape && polygonCoordinates.length > 1){
        const carIsInsideHole = polygonCoordinates.slice(1, polygonCoordinates.length).some(hole => inside(carLocation, wrapPolygon(hole)))
        console.log('Checking holes', !carIsInsideHole)
        return !carIsInsideHole;
    } else {
        console.log('No Polygon holes found', carIsInsideShape)
        return carIsInsideShape;
    }
    
}

module.exports = isCarInBoundries;