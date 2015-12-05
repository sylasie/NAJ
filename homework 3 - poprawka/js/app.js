var index = 0;

var reduceTime = setInterval(function () {
    UAM.aircrafts.forEach(function(air) {
        UAM.reduceTimeToExecute(air,1);
    });
},1000);

$(function() {

    $('.airplane').click(function () {
        $('#services').hide();
        $('#airplanes').show();
    });

    $('.service').click(function () {
        $('#airplanes').hide();
        $('#services').show();
    });

    $('#addCode').click(function (e) {
        var code = $("input[name='airName']").val();

        UAM.addAircraft(code);
        index++;
        console.log(UAM.aircrafts);
        return false;
    });

    $('#aircrafts').on('click','.js-remove',function() {
        var ind = $(this).parent().parent().data('id');
        if(confirm("Czy naprawdę chcesz usunąć samolot "+ $(this).parent().parent().data('code') +"?")) {
            UAM.removeAircraft(UAM.aircrafts[ind]);
        }
    });

    $('#addService').click(function (e) {
        var name = $("input[name='serviceName']").val();
        var code = $("#namesAir option:selected").text();
        var index = $("#namesAir").val();

        var serviceTime = $("input[name='timeService']").val();

        UAM.addWorkToAircraft(UAM.aircrafts[index],name,serviceTime);
        return false;
    });

});



