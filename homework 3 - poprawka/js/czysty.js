(function (global) {
    var mapArray;

    if (!global.UAM) {
        global.UAM = {};
    }
    var indexServ = 0;

    global.UAM.aircrafts = [];


    global.UAM.addAircraft = function (newAircraftCode) {
        if (typeof newAircraftCode !== "string") {
            return;
        }
        $("#namesAir").append("<option value='"+this.aircrafts.length+"'>"+newAircraftCode+"</option>");
        $('#aircrafts').append("<tr data-id='"+this.aircrafts.length+"' data-code='"+newAircraftCode+"' id='air"+this.aircrafts.length+"' class='air'>" +
            "<td id='ind'>" + index + "</td>" +
            "<td>" + newAircraftCode + "</td>" +
            "<td class='state'><div class='label label-success'>OK</div></td>" +
            "<td><button type=\"button\" class=\"btn btn-xs btn-danger js-remove\">Usuń</button></td>" +
            "</tr>");

        var aircraft = { code: newAircraftCode, services: [] };
        this.aircrafts.push(aircraft);

        return aircraft;
    };

    global.UAM.removeAircraft = function (aircraftObj) {
        var index = this.aircrafts.indexOf(aircraftObj);

        if (index >= 0) {
            this.aircrafts.splice(index, 1);
            $("#air"+index).remove();
            return true;
        } else {
            return false;
        }
    };

    global.UAM.addWorkToAircraft = function(aircraftObj, name, timeToExecute) {
        timeToExecute = parseInt(timeToExecute);
        if (aircraftObj == null ||
            typeof aircraftObj !== "object" ||
            typeof name !== "string" ||
            isNaN(timeToExecute)) {
            return;
        }
        var work = { name: name, timeToExecute: timeToExecute };
        var index_service = aircraftObj.services.length;
        var indx = this.aircrafts.indexOf(aircraftObj);
        $("#aircrafts #air"+indx+" .state").html("<div class='label label-danger'>W NAPRAWIE</div>");
        $("#serv").append("<tr id='service"+indx+"_"+index_service+"'><td>"+indexServ+"</td><td>"+name+"</td><td>"+aircraftObj.code+"</td><td><div class='time'>"+timeToExecute+"</div></td></tr>");
        indexServ++;
        aircraftObj.services.push(work);

        return true;
    };


    global.UAM.reduceTimeToExecute = function(aircraftObj, time) {
        time = parseInt(time);
        if (aircraftObj == null ||
            typeof aircraftObj !== "object" ||
            !(aircraftObj.services instanceof Array) ||
            isNaN(time)) {
            return;
        }

            var index = this.aircrafts.indexOf(aircraftObj);

            aircraftObj.services.forEach(function(service) {
                var index_service = aircraftObj.services.indexOf(service);

                service.timeToExecute -= time;
                $("#service"+index+"_"+index_service+" .time").html(service.timeToExecute);
                if (service.timeToExecute <= 0){
                    aircraftObj.services.splice(index_service, 1);
                    $("#service"+index+"_"+index_service).remove();
                    if (aircraftObj.services.length == 0){
                        $("#aircrafts #air"+index+" .state").html("<div class='label label-success'>OK</div>");

                    }
                }

            });

    };


    global.UAM.getAircraftsForRepairs = function(maxTimeToExecute) {
        maxTimeToExecute = parseInt(maxTimeToExecute);
        if (isNaN(maxTimeToExecute)) {
            return;
        }

        var aircraftsForRepairs = [];

        this.aircrafts.forEach(function(aircraft) {
            if (aircraft.services instanceof Array) {
                aircraft.services.forEach(function(service) {
                    if (service.timeToExecute <= maxTimeToExecute &&
                        aircraftsForRepairs.indexOf(aircraft) < 0) {
                        aircraftsForRepairs.push(aircraft);
                    }
                });
            }
        });

        return aircraftsForRepairs;
    };

}(window));

/*
Przykład użycia:
var newAircraft1 = UAM.addAircraft('SP-XY1');
var newAircraft2 = UAM.addAircraft('SP-XY2');
UAM.addWorkToAircraft(newAircraft1, 'serviceXY1a', 110);
UAM.addWorkToAircraft(newAircraft1, 'serviceXY1b', 130);
UAM.reduceTimeToExecute(newAircraft1, 20);
var sxy2a = UAM.addWorkToAircraft(newAircraft2, 'serviceXY2a', 130);
var sxy2b = UAM.addWorkToAircraft(newAircraft2, 'serviceXY2b', 160);
UAM.reduceTimeToExecute(newAircraft2, 20);
UAM.getAircraftsForRepairs(100); // [ newAircraft1 ]
UAM.removeAircraft(newAircraft1);
UAM.getAircraftsForRepairs(100); // []
UAM.reduceTimeToExecute(newAircraft2, 20);
UAM.getAircraftsForRepairs(100); // [ newAircraft2 ]
*/