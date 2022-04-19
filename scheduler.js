"use strict";

const JENGINE = require("jms-engine").connect("scheduler");
function onSchedule(message) {
    message.handled = true;
    let {name = false, timer = 1000, ...args} = message.payload;
    if (!name) {
        message.error = "Scheduler: Wrong message name";
        return message;
    }
    setTimeout(() => {
        try {
            JENGINE.enqueue(name, args);
        } catch(err) {
            JENGINE.error("Scheduler", err.stack);
        }
    }, timer);
    message.result = args;
    return message;
}
function onHalt() {
    process.exit(0);
}
JENGINE.install("schedule", onSchedule);
JENGINE.install("halt", onHalt);