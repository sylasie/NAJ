var todos = [];
var index = 0;
var active = 0;

var unactive = [];
function add(id,text){
    $("#todos").append('<div class="todo" data-id="'+id+'"><input id="check'+id+'" type="checkbox" name="do[]"/><label for="check'+id+'">'+text+'</label><input class="change" type="text" name="change'+id+'" value="'+text+'"/></div>');
    todos.push(text);
    index++;
    active++;
};

$("#todo").keypress(function(e){
	if(e.which == 13) {
        var text = $(this).val();

        add(index,text);


    }
});

function edit(id,text){
    todos[id] = text;

}

function remove(id) {
	todos.splice(id, 1);
}


function refreshinfo()
{
    var unac = unactive.length;
    $("#removeall").html("Clear "+unac+" items");
    var active = todos.length - unactive.length;
    $("#itemsleft").html(active);

}

function removeall(){
    for (var i in unactive){
        console.log(unactive[i]);
        var id = unactive[i];
        todos.splice(id,1);
        $(".todo[data-id='"+id+"']").remove();


    }
    unactive = [];
    refreshinfo();
}

$("#todos").on('keypress','.change',function(e) {
    if(e.which == 13) {

        var text = $(this).val();
        var id = $(this).parent().data('id');
        edit(id,text);
        $(this).parent().find('label').text(text);
        $(this).parent().removeClass('showed');
    }
});

$("#todos").on('click','input[type="checkbox"]',function(e) {

    var id = $(this).parent().data('id');
    if ($(this).prop('checked')==true){
        unactive.push(id);
        $(this).parent().addClass("deleted");
    } else {
        var text = todos[id];
        var index = unactive.indexOf(text);
        unactive.splice(index, 1);
        $(this).parent().removeClass("deleted");
    }
    refreshinfo();



});


$("#todos").on('click','.edit',function(e) {


    var id = $(this).parent().data('id');
    if (!$(this).parent().hasClass('showed')){
        $(this).parent().addClass('showed');
    } else {
        $(this).parent().removeClass('showed');
    }


});

$("#removeall").click(function(){
    removeall();
});

	





