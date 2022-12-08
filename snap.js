/**
 * Method which implements the 'snapping' logic for the starting point of the (new) appointment.
 *
 * @param {number} calendar_height Height, in pixels, of the calendar.
 * @param {number} pixel_value Raw selected pixel value. This value represent the earliest selected time (i.e. if one
 * drags from bottom to top, the dragged value will be passed).
 * @param {string} customer_id The value filled in the input field Customer.
 * @param {string} employee_id The value filled in the input field Employee.
 *
 * @return {number} Pixel value that needs to be used as the starting point of the (new) appointment.
 */
function snapStart(calendar_height, pixel_value, customer_id, employee_id) {
    // console.log(customer_data[customer_id][employee_id]);

    return pixel_value;
}

/**
 * Method which implements the 'snapping' logic for the stopping point of the (new) appointment.
 *
 * @param {number} calendar_height Height, in pixels, of the calendar.
 * @param {number} pixel_value Raw selected pixel value. This value represent the latest selected time (i.e. if one
 * drags from bottom to top, the initial value will be passed).
 * @param {string} customer_id The value filled in the input field Customer.
 * @param {string} employee_id The value filled in the input field Employee.
 *
 * @return {number} Pixel value that needs to be used as the stopping point of the (new) appointment.
 */
function snapStop(calendar_height, pixel_value, customer_id, employee_id) {
    // console.log(customer_data[customer_id][employee_id]);
    return pixel_value;
}
