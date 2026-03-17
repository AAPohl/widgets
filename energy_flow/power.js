$.widget("sv.power_powerflow", $.sv.widget, {
    initSelector: 'div[data-widget="power.powerflow"]',

    _create: function () {
        this._super();
    },

    _update: function (response) {
        var pv = parseFloat(response[0]);        
        var grid = parseFloat(response[1]);
        var battery = parseFloat(response[2]);
        var house = parseFloat(response[3]); 
	    var vehicle = parseFloat(response[4]);
        var heating = parseFloat(response[5]);
      
        var remainingPv = pv;
        if(remainingPv > 0 && grid < 0) {
            $('#pvToGrid').toggle(true); 
            remainingPv = remainingPv + grid;
        }
        else {
            $('#pvToGrid').toggle(false); 
        }

        if(remainingPv > 0 && heating > 0) {
            $('#pvToHeating').toggle(true); 
            remainingPv = remainingPv - heating;
        }
        else {
            $('#pvToHeating').toggle(false); 
        }   

        if(remainingPv > 0 && vehicle > 0) {
            $('#pvToVehicle').toggle(true); 
            remainingPv = remainingPv - vehicle;
        }
        else {
            $('#pvToVehicle').toggle(false); 
        }

        if(remainingPv > 0 && house > 0) {
            $('#pvToHome').toggle(true); 
            remainingPv = remainingPv - house;
        }
        else {
            $('#pvToHome').toggle(false); 
        }
        $('#pvToBattery').toggle(remainingPv > 0 && battery < 0); 

        var remainingGrid = grid;
        if(remainingGrid > 0 && house > 0) {
            $('#gridToHome').toggle(true); 
            remainingGrid = remainingGrid - house;
        }
        else {
            $('#gridToHome').toggle(false); 
        }
        if(remainingGrid > 0 && heating > 0) {
            $('#gridToHeating').toggle(true); 
            remainingGrid = remainingGrid - heating;
        }
        else {
            $('#gridToHeating').toggle(false); 
        }
        if(remainingGrid > 0 && vehicle > 0) {
            $('#gridToVehicle').toggle(true); 
            remainingGrid = remainingGrid - vehicle;
        }
        else {
            $('#gridToVehicle').toggle(false); 
        }
        $('#gridToBattery').toggle(remainingGrid > 0 && battery < 0); 

        var remainingBattery = battery;
        if(remainingBattery > 0 && heating > 0) {
            $('#batteryToHeating').toggle(true); 
            remainingBattery = remainingBattery - heating;
        }
        else {
            $('#batteryToHeating').toggle(false); 
        }
        if(remainingBattery > 0 && vehicle > 0) {
            $('#batteryToVehicle').toggle(true); 
            remainingBattery = remainingBattery - vehicle;
        }
        else {
            $('#batteryToVehicle').toggle(false); 
        }

        if(remainingBattery > 0 && house > 0) {
            $('#batteryToHome').toggle(true); 
            remainingBattery = remainingBattery - house;
        }
        else {
            $('#batteryToHome').toggle(false); 
        }
        $('#batteryToGrid').toggle(remainingBattery > 0 && grid < 0); 
    }
});

$.widget("sv.power_powerdistribution", $.sv.widget, {
    initSelector: 'div[data-widget="power.powerdistribution"]',

    _create: function () {
        this._super();
    },

    _update: function (response) {
        var pv = splitInputOutut(response[0]); 
        var grid = splitInputOutut(response[1]);
        var battery = splitInputOutut(response[2]);
        var house = splitInputOutut(response[3]); 
    	var vehicle = splitInputOutut(response[4]);
        var heating = splitInputOutut(response[5]);

        var input = pv[0] + grid[0] + battery[0];
        var inputPvLength = pv[0] / input;
	    var inputGridLength = grid[0] / input;
	    var inputBatteryLength = battery[0] / input;
        
        var output = house[0] + vehicle[0] + battery[1] + heating[0] + grid[1];
	    var outputHouseLength = house[0] / output;
        var outputVehicleLength = vehicle[0] / output;
	    var outputBatteryLength = battery[1] / output;
	    var outputHeatingLength = heating[0] / output;
        var outputGridLength = grid[1] / output;

	    arrangeElement("#inputPv", 0, inputPvLength);
	    arrangeElement("#inputBattery", inputPvLength, inputBatteryLength );
        arrangeElement("#inputGrid", inputPvLength + inputBatteryLength, inputGridLength );
        
        arrangeElement("#outputHouse", 0, outputHouseLength );
        arrangeElement("#outputVehicle", outputHouseLength, outputVehicleLength );
        arrangeElement("#outputHeating", outputHouseLength + outputVehicleLength, outputHeatingLength );
        arrangeElement("#outputBattery", outputHouseLength + outputVehicleLength + outputHeatingLength, outputBatteryLength );
        arrangeElement("#outputGrid", outputHouseLength + outputVehicleLength + outputHeatingLength + outputBatteryLength, outputGridLength );
        
        function splitInputOutut(source) {
            var value = parseFloat(source);     
            var input = Math.max(0, value);
            var output = value > 0 ? 0 : Math.abs(value);
            return [input, output];
        }
        function arrangeElement(baseClass, x, width) { 
            var iconClass = baseClass + "Icon";
            $(baseClass).attr('x', x * 500); 
            $(iconClass).attr('x', x * 500); 
            $(baseClass).width( width * 500);
            $(iconClass).width( width * 500);
            $(iconClass).toggle(width > 0.1);
	    };

	
    }
});
