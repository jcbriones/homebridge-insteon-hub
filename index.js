var Service, Characteristic;
var request = require('sync-request');

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-insteon-hub", "InsteonHub", InsteonHub);
}

function InsteonHub(log, config) {
    this.log = log;

    // Config info
    this.host = config["host"];
    this.port = config["port"] || "25105";
    this.username = config["username"];
    this.password = config["password"];
    this.device_name = config["device_name"] || "Device Name";
    this.device_id = config["device_id"];
    this.device_type = config["device_type"];
    this.manufacturer = config["manufacturer"] || "Insteon Hub";
    this.model = config["model"] || "Model not available";
    this.serial = config["serial"] || "Non-defined serial";
}

InsteonHub.prototype = {

    // TODO: setState, getState, getCurrentState, getTargetState, setTargetState
    httpRequest: function(url, body, method, username, password, sendimmediately, callback) {
        cons
        request({
                url: url,
                body: body,
                method: method,
                rejectUnauthorized: false
            },
            function(error, response, body) {
                callback(error, response, body)
            })
    },

    identify: function(callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function() {
        this.informationService = new Service.AccessoryInformation();
        this.informationService
            .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
            .setCharacteristic(Characteristic.Model, this.model)
            .setCharacteristic(Characteristic.SerialNumber, this.serial);

        // =============
        // Sensors
        // =============
        // Contact Sensor
        if (this.type == "contact") {
            this.hubServices = new Service.ContactSensor(this.name);
            this.hubServices
                .getCharacteristic(Characteristic.ContactSensorState)
                .on('get', this.getState.bind(this));
        }
        // Motion Sensor
        else if (this.type == "motion") {
            this.hubServices = new Service.MotionSensor(this.name);
            this.hubServices
                .getCharacteristic(Characteristic.MotionDetected)
                .on('get', this.getState.bind(this));
        }
        // Leak Sensor
        else if (this.type == "leak") {
            this.hubServices = new Service.LeakSensor(this.name);
            this.hubServices
                .getCharacteristic(Characteristic.LeakDetected)
                .on('get', this.getState.bind(this));
        }
        // =============
        // Controllables
        // =============
        // Lightbulb
        else if (this.type == "lightbulb") {
            this.hubServices = new Service.Lightbulb(this.name);
            // On/Off
            this.hubServices
                .getCharacteristic(Characteristic.On)
                .on('get', this.getState.bind(this));
            this.hubServices
                .getCharacteristic(Characteristic.On)
                .on('set', this.setState.bind(this));
        }
        // Dimmable Lightbulb
        else if (this.type == "lightbulb-dimmer") {
            this.hubServices = new Service.Lightbulb(this.name);
            // On/Off
            this.hubServices
                .getCharacteristic(Characteristic.On)
                .on('get', this.getState.bind(this));
            this.hubServices
                .getCharacteristic(Characteristic.On)
                .on('set', this.setState.bind(this));
            // Brightness/Dimmer
            this.hubServices
                .getCharacteristic(Characteristic.Brightness)
                .on('get', this.getState.bind(this));
            this.hubServices
                .getCharacteristic(Characteristic.Brightness)
                .on('set', this.setState.bind(this));
        }
        // Switch
        else if (this.type == "switch") {
            this.hubServices = new Service.Switch(this.name);
            // On/Off
            this.hubServices
                .getCharacteristic(Characteristic.On)
                .on('get', this.getState.bind(this));
            this.hubServices
                .getCharacteristic(Characteristic.On)
                .on('set', this.setState.bind(this));
        }
        // Fan
        else if (this.type == "fan") {
            this.hubServices = new Service.Fan(this.name);
            // On/Off
            this.hubServices
                .getCharacteristic(Characteristic.On)
                .on('get', this.getState.bind(this));
            this.hubServices
                .getCharacteristic(Characteristic.On)
                .on('set', this.setState.bind(this));
        }
        // Outlet
        else if (this.type == "outlet") {
            this.hubServices = new Service.Outlet(this.name);
            // On/Off
            this.hubServices
            .getCharacteristic(Characteristic.On)
            .on('get', this.getState.bind(this));
            this.hubServices
            .getCharacteristic(Characteristic.On)
            .on('set', this.setState.bind(this));
        }
        // Garage Door
        else if (this.type == "garage") {
            this.hubServices = new Service.GarageDoorOpener(this.name);
            this.hubServices
                .getCharacteristic(Characteristic.CurrentDoorState)
                .on('get', this.getCurrentState.bind(this));
            this.hubServices
                .getCharacteristic(Characteristic.TargetDoorState)
                .on('get', this.getTargetState.bind(this));
            this.hubServices
                .getCharacteristic(Characteristic.TargetDoorState)
                .on('set', this.setTargetState.bind(this));
        }

        return [this.informationService, this.hubServices];
    }
};
