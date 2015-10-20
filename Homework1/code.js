(function (global) {
	var mapArray;


    global.aircrafts = [];
    
    //////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Sample aircraft with sample service  /////////////// 
    
    global.aircrafts.push({
        code: 'SP-ABC',
        services: []
    });
    
    global.aircrafts[0].services.push({
        name: 'smth1',
        timeToExecute: 120
    });
    
    //////////////////////////////////////////////////////////////////////////////////////

    global.addAircraft = function (newAircraftCode) {
        aircrafts.push({
            code: newAircraftCode,
            services: []
        })
    };

    global.removeAircraft = function (aircraftObj) {
        for(var i=0;i<aircrafts.length;i++){
            if(aircraftObj==this[i]) this.splice(i, 1);
        }       
    };

    global.addWorkToAircraft = function(aircraftObj, name, timeToExxecute) {
        for(var i=0;i<aircrafts.length;i++){
            if(aircraftObj==this[i]){
               aircrafts[0].services.push({
                    name: name,
                    timeToExecute: timeToExxecute
                });
            }
        }
    };
        
    global.reduceTimeToExecute = function(time) {
        for(var i=0,i<aircrafts.length(),i++) {
            for(var j=0,j<aircrafts[i].services,j++){
                aircrafts[i].services[j].timeToExecute = aircrafts[i].services[j].timeToExecute - time;
            }
        }
    };
    
    global.getAircraftsForRepairs = function(maxTimeToExecute) {
        for(var i=0, i<aircrafts.length(), i++){
             for(var j=0,j<aircrafts[i].services,j++){
                 if(aircrafts[i].services[j].timeToExecute <= maxTimeToExecute) {
                     maxTimeToExecute = maxTimeToExecute - aircrafts[i].services[j].timeToExecute;
                     aircrafts[i].services[j].remove();
                 }
            }
        }
    };

}(window));

/*

Przykład użycia:

var newAircraft1 = addAircraft('SP-XY1');
var newAircraft2 = addAircraft('SP-XY2');

addWorkToAircraft(newAircraft1, 'serviceXY1a', 110);
addWorkToAircraft(newAircraft1, 'serviceXY1b', 130);
reduceTimeToExecute(newAircraft1, 20);

var sxy2a = addWorkToAircraft(newAircraft2, 'serviceXY2a', 130);
var sxy2b = addWorkToAircraft(newAircraft2, 'serviceXY2b', 160);
reduceTimeToExecute(newAircraft2, 20);

getAircraftsForRepairs(100); // [ newAircraft1 ]

removeAircraft(newAircraft1);

getAircraftsForRepairs(100); // []

reduceTimeToExecute(newAircraft2, 20);

getAircraftsForRepairs(100); // [ newAircraft2 ]

*/
