const DEFAULT_INCREMENT = 15;
const CALENDAR_HEIGHT = 1440;




/**
 * Function which converts the pixel at which the mouse is to the seconds of the day it has.
 * 
 * @param {number} calendar_height The height of the calendar canvas thingy. 
 * @returns {number} the amount of seconds in one pixel.
 */
function seconds_per_pixel(calendar_height) {
    return (24 * 60 * 60) / calendar_height;
}

/**
 * Converts a pixel value to the minutes in a day, based on the calendar height
 * 
 * @param {number} pixel_value the pixel value as passed to the snapStart and snapEnd functions.
 * @param {number} calendar_height the calendar height as passed to snapStart and snapEnd
 * @returns The minute value equivalent to the provided pixel_value.
 */
function pixelsToMinutes(pixel_value, calendar_height) {
    return Math.round((seconds_per_pixel(calendar_height) * pixel_value) / 60);
};

/**
 * Converts minutes from a day to the desired pixel value.
 * 
 * @param {number} minutes Minute offset from the beginning of the day, where 0=00:00, 1=00:01, etc.)
 * @param {number} calendar_height the calendar height as passed to snapStart and snapEnd
 * @returns the pixel value equivalent to the provided minutes
 */
function minutesToPixels(minutes, calendar_height) {
    return Math.round((minutes * 60) / seconds_per_pixel(calendar_height));
};

/**
 * Constrains the pixel value according to the minute increment.
 * 
 * @param {number} pixel_value current raw pixel value
 * @param {number} calendar_height height of the calendar
 * @param {number} minute_increment minute increment according to which to snap 
 * @returns constrained pixel value, according to the minute increment
 */
function constrain(pixel_value, calendar_height, minute_increment = DEFAULT_INCREMENT) {
    const minutes = pixelsToMinutes(pixel_value, calendar_height);
    const multiples = Math.floor(minutes / minute_increment);
    const constrained_minutes = multiples * minute_increment;
    const new_pixels = minutesToPixels(constrained_minutes, calendar_height);
    return new_pixels;
}

/**
 * Method which implements the 'snapping' logic for the starting point of the (new) appointment.
 *
 * @param {number} calendar_height Height, in pixels, of the calendar.
 * @param {number} pixel_value Raw selected pixel value. This value represent the earliest selected time (i.e. if one
 * drags from bottom to top, the dragged value will be passed).
 * @param {string} customer_id The value filled in the input field Customer.
 * @param {string} employee_id The value filled in the input field Employee.
 * @param {string} date The value filled in the input field Date.
 *
 * @return {number} Pixel value that needs to be used as the starting point of the (new) appointment.
 */
function snapStart(calendar_height, pixel_value, customer_id, employee_id, date) {
    const { startIncrementAggregate } = getEmployeeData(customer_id, employee_id);
    const [increment, _] = getMostFrequent(startIncrementAggregate);
    return constrain(pixel_value, calendar_height, parseInt(increment));
}


/**
 * Method which implements the 'snapping' logic for the stopping point of the (new) appointment.
 *
 * @param {number} calendar_height Height, in pixels, of the calendar.
 * @param {number} pixel_value Raw selected pixel value. This value represent the latest selected time (i.e. if one
 * drags from bottom to top, the initial value will be passed).
 * @param {string} customer_id The value filled in the input field Customer.
 * @param {string} employee_id The value filled in the input field Employee.
 * @param {string} date The value filled in the input field Date.
 *
 * @return {number} Pixel value that needs to be used as the stopping point of the (new) appointment.
 */
function snapStop(calendar_height, pixel_value, customer_id, employee_id, date) {
    const { stopIncrementAggregate } = getEmployeeData(customer_id, employee_id);
    const [increment, _] = getMostFrequent(stopIncrementAggregate);

    return constrain(pixel_value, calendar_height, parseInt(increment));
}



/**
 * Gets employee data and extends it a bit
 * @param {*} customer_id 
 * @param {*} employee_id 
 */
function getEmployeeData(customer_id, employee_id) {
    let events = customer_data[customer_id][employee_id];
    let durationAggregate = {};
    let startAggregate = {};
    let stopAggregate = {};
    let increments = [15, 10, 5, 2, 1];
    let startIncrementAggregate = {
        1: 0,
        2: 0,
        5: 0,
        10: 0,
        15: 0,
    };
    let stopIncrementAggregate = {
        1: 0,
        2: 0,
        5: 0,
        10: 0,
        15: 0,
    };
    let incrementCount = 0;
    events = events.map(e => { return { ...e, duration: e.stop - e.start }; });
    const durations = events.map(e => e.duration);
    events.map(e => e.duration).forEach(duration => {
        if (!(duration in durationAggregate)) {
            durationAggregate[duration] = 0;
        }
        durationAggregate[duration] += 1;
    });

    events.map(e => e.start).forEach(start => {
        for (const increment of increments) {
            if (start % (increment * 60) === 0) {
                startIncrementAggregate[increment]++;
                incrementCount++;
                break;
            }
        }
        if (!(start in startAggregate)) {
            startAggregate[start] = 0;
        }
        startAggregate[start] += 1;
    });
    events.map(e => e.stop).forEach(stop => {
        for (const increment of increments) {
            if (stop % (increment * 60) === 0) {
                stopIncrementAggregate[increment]++;
                incrementCount++;
                break;
            }
        }
        if (!(stop in stopAggregate)) {
            stopAggregate[stop] = 0;
        }
        stopAggregate[stop] += 1;
    });




    const employeeData = {
        events,
        durationAggregate,
        startAggregate,
        stopAggregate,
        startIncrementAggregate,
        stopIncrementAggregate,
        minimumDuration: Math.min(...durations),
    };
    return employeeData;
};

function getMostFrequent(aggregate) {
    let sortable = [];
    for (const k in aggregate) {
        sortable.push([k, aggregate[k]]);
    }
    sortable.sort((a, b) => {
        return b[1] - a[1];
    });
    return sortable[0];
}