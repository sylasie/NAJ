function getAirplaneTemplate(aircraftObj) {
    return  "<tr data-id='"+aircraftObj.length+"' data-code='"+newAircraftCode+"' id='air"+this.aircrafts.length+"' class='air'><td>"+newAircraftCode+"</td><td class='state'><div class='label label-success'>OK</div></td><td><div class='label label-success add_service'>Dodaj</div><div class='label label-danger remove_air'>Usuñ</div></td></tr>";
}