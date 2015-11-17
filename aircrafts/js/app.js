(function(global) {
  var $aircrafts = $('#aircrafts');
  var $services = $('#services');
  var $aircraftsCount = $('#aircraftsCount');
  var $servicesCount = $('#servicesCount');
  var $addServiceModal = $('#addServiceModal');
  var $menu = $(".js-menu");
  var $newAircraftForm = $('#newAircraftForm');
  var minAircraftServiceTime = 50;

  if (!global.UAM) {
    global.UAM = {};
  }

  global.UAM.LocalStorage = (function() {
    function LocalStorage() {}

    LocalStorage.get = function(field) {
      return JSON.parse(localStorage.getItem(field));
    };

    LocalStorage.set = function(field, value) {
      return localStorage.setItem(field, JSON.stringify(value));
    };

    LocalStorage.remove = function(field) {
      return localStorage.removeItem(field);
    };

    return LocalStorage;
  })();

  global.UAM.aircrafts = global.UAM.LocalStorage.get('aircrafts') || [];

  global.UAM.updateAircraftsStore = function() {
    global.UAM.LocalStorage.set('aircrafts', this.aircrafts);
  };

  global.UAM.render = function() {
    $menu
      .find('li')
      .click(function() {
        var id = $(this).data('id');
        $menu
          .find('li')
          .removeClass('active')
          .end()
          .find("[data-id="+id+"]")
          .addClass('active');
      });
    $newAircraftForm
      .validator()
      .submit(function(e) {
        if (e.isDefaultPrevented()) {
          return;
        }
        e.preventDefault();
        var $form = $(this);
        var data = $form.serializeJSON();
        if(global.UAM.addAircraft(data.code)) {
          $form[0].reset();
          global.UAM.refreshView();
        }
      });
    this.refreshView();
    setTimeout(function() {
      global.UAM.aircrafts.forEach(function(aircraft){
        global.UAM.reduceTimeToExecute(aircraft, 1);
      });

      global.UAM.refreshView();
    }, 10000)
  };

  global.UAM.refreshView = function() {
    this.renderAircrafts();
    this.renderDashboard();
    this.renderServices();
  }

  global.UAM.renderDashboard = function() {
    $aircraftsCount.text(this.aircrafts.length);
    servicesCount = 0;
    this.aircrafts.forEach(function(aircraft){
      servicesCount += aircraft.services.length;
    });
    $servicesCount.text(servicesCount);
  }

  global.UAM.renderAircrafts = function() {
    var aircraftsForRepairs = this.getAircraftsForRepairs(minAircraftServiceTime);
    $aircrafts.empty();
    this.aircrafts.forEach(function(aircraft, index) {
      index += 1;
      var label = "";
      var labelText = "";
      if (aircraftsForRepairs.indexOf(aircraft) < 0) {
        label = "success";
        labelText = "Dobry";
      } else {
        label = "danger";
        labelText = "Zepsuty";
      }

      var aircraftTemplate = "<tr>" +
        "<td>" + index + "</td>" +
        "<td>" + aircraft.code + "</td>" +
        "<td>" + aircraft.services.length + "</td>" +
        "<td><span class=\"label label-" + label + "\">"+ labelText +"</span></td>" +
        "<td>" +
        "<div class=\"btn-group\" role=\"group\"><button type=\"button\" class=\"btn btn-xs btn-primary\"" +
        "data-toggle=\"modal\" data-target=\"#addServiceModal\" data-aircraft-code=\"" +
        aircraft.code + "\">Dodaj naprawę</button>" +
        "<button type=\"button\" class=\"btn btn-xs btn-danger js-remove\">Usuń</button>" +
        "</div></td></tr>"
      var $aircraft = $(aircraftTemplate);
      $aircraft
        .find('.js-remove')
        .click(function() {
          if(confirm("Czy naprawdę chcesz usunąć samolot "+ aircraft.code +"?")) {
            global.UAM.removeAircraft(aircraft);
            global.UAM.refreshView();
          }
        });
      $aircrafts.append($aircraft);
    });
  };

  global.UAM.renderServices = function() {
    $services.empty();
    services = [];

    this.aircrafts.forEach(function(aircraft){
      var aircraftServices = aircraft.services;
      aircraftServices.forEach(function(service, index){
        services.push({
          service: service,
          aircraft: aircraft
        });
      });
    });

    services.sort(function(serviceA, serviceB) {
      return serviceA.service.timeToExecute - serviceB.service.timeToExecute;
    });

    services.forEach(function(service, index) {
      index += 1;
      var aircraft = service.aircraft;
      var service = service.service;
      var label = "";
      if (service.timeToExecute >= minAircraftServiceTime) {
        label = "success";
      } else if (service.timeToExecute > 0) {
        label = "warning";
      } else {
        label = "danger";
      }

      var serviceTemplate = "<tr>" +
        "<td>" + index + "</td>" +
        "<td>" + service.name + "</td>" +
        "<td><span class=\"label label-" + label + "\">"+ service.timeToExecute +"</span></td>" +
        "<td>" + aircraft.code +"</td></tr>"
      var $service = $(serviceTemplate);

      $services.append($service);
    });
  };

  global.UAM.addServiceHandler = function (e) {
    if (e.isDefaultPrevented()) {
      return;
    }
    e.preventDefault();
    var $form = $(e.target);
    var data = $form.serializeJSON();
    var aircrafts = this.aircrafts.filter(function(aircraft) {
      return data.code === aircraft.code;
    });
    var aircraft = aircrafts[0];

    this.addServiceToAircraft(aircraft, data.name, data.timeToExecute);
    this.refreshView();
    $addServiceModal.modal('hide');
  };

  $addServiceModal
    .on('show.bs.modal', function(event) {
      var button = $(event.relatedTarget);
      var aircraftCode = button.data('aircraft-code');
      $(this).find('input#aircraftCode').val(aircraftCode);
    })
    .on("hide.bs.modal", function() {
      $(this).find('form')[0].reset();
    })
    .find('form')
    .validator()
    .submit(global.UAM.addServiceHandler.bind(global.UAM));

  global.UAM.addAircraft = function(newAircraftCode) {
    if (typeof newAircraftCode !== "string") {
      return;
    }

    var aircraft = { code: newAircraftCode, services: [] };
    this.aircrafts.push(aircraft);
    this.updateAircraftsStore();

    return aircraft;
  };

  global.UAM.removeAircraft = function(aircraft) {
    var index = this.aircrafts.indexOf(aircraft);

    if (index >= 0) {
        this.aircrafts.splice(index, 1);
        this.updateAircraftsStore();
        return true;
    } else {
        return false;
    }
  };

  global.UAM.addServiceToAircraft = function(aircraft, name, timeToExecute) {
    timeToExecute = parseInt(timeToExecute);
    if (aircraft == null ||
        typeof aircraft !== "object" ||
        typeof name !== "string" ||
        isNaN(timeToExecute)) {
        return;
    }

    var service = { name: name, timeToExecute: timeToExecute };
    aircraft.services.push(service);
    this.updateAircraftsStore();

    return service;
  };

  global.UAM.markServiceAsDone = function(aircraft, serviceName) {
    if (aircraft == null ||
        typeof aircraft !== "object" ||
        typeof serviceName !== "string") {
        return;
    }

    aircraft.services = aircraft.services.filter(function(service) {
      return service.name !== serviceName;
    });
    this.updateAircraftsStore();
  }

  global.UAM.reduceTimeToExecute = function(aircraft, time) {
    time = parseInt(time);
    if (aircraft == null ||
        typeof aircraft !== "object" ||
        !(aircraft.services instanceof Array) ||
        isNaN(time)) {
        return;
    }

    aircraft.services.forEach(function(service) {
        service.timeToExecute -= time;
		if(service.timeToExecute <= 0){
		  global.UAM.markServiceAsDone(aircraft, service.name);
          alert("Zakończono naprawę "+service.name+" samolotu "+aircraft.code);
          global.UAM.refreshView();
		}
		
    });
    this.updateAircraftsStore();
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

  global.UAM.render();
}(window));

