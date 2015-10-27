(function (global) {
	if (!global.UAM) {
		global.UAM = {};
	}

	function newObject(constr) {
	
		var nowyObject = Object.create(constr.prototype);
		var argumenty = Array.prototype.slice.call(arguments,1);
		var nowyObjectArgs = constr.apply(nowyObject,argumenty);
		
		if (typeof nowyObjectArgs == 'object'){
   			return nowyObjectArgs;
		}
		else{
			 return nowyObject;
		}
	}

	global.UAM.newObject = newObject;
}(window));

/*
	Zaimplementuj funkcję newObject, która będzie działać analogicznie do operatora new. Pierwszym parametrem funkcji niech będzie
	konstruktor, natomiast pozostałe to parametry konstruktora. Przykładowe zastosowanie:

	new MyClass(arg1, arg2) -> newObject(MyClass, arg1, arg2)
*/


