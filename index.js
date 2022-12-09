(function() {
    const CALENDAR_HEIGHT = 1440;

    const render = (selector, template) => {
            document.querySelector(selector).insertAdjacentHTML('beforeend', template);
    }

    const calendarHour = (hour) => `
        <div class="hour">
            <div class="time"> ${hour.toString(10).padStart(2, '0')}:00 </div>
            <div class="appointments"></div>
        </div>
    `

    const calendarEntry = (yStart, yEnd, template) => {
        const y0 = yStart > yEnd ? yEnd : yStart;
        const y1 = yStart > yEnd ? yStart : yEnd;

        const start = snapStart(CALENDAR_HEIGHT, y0, customerId(), employeeId(), date());
        const stop = snapStop(CALENDAR_HEIGHT, y1, customerId(), employeeId(), date());

        const content = appointmentTitle(start, stop);

        return `
            <div class="calendar-entry ${template ? "calendar-entry-template" : ""}" style="top:${start}px; height: ${stop - start}px">
                ${content}
            </div>
        `;
    }

    const clearTemplate = () => {
        const template = document.querySelector('.calendar-entry-template');
        template && template.remove();
    }

    let downClick = null;

    const onMouseDown = (container) => ({ clientX, clientY, target }) => {
        const rect = container.getBoundingClientRect();

        downClick = {
            x: clientX + container.scrollLeft - rect.left,
            y: clientY + container.scrollTop - rect.top,
        };
    }

    const onMouseUp = (container) => ({ clientX, clientY }) => {
        if (!downClick) return;
        const rect = container.getBoundingClientRect();

        onDragEnd({
            xStart: downClick.x,
            yStart: downClick.y,
            x: clientX + container.scrollLeft - rect.left,
            y: clientY + container.scrollTop - rect.top,
        });
        downClick = null;
    }

    const onMouseMove = (container) => ({ clientX, clientY }) => {
        if (!downClick) return;

        const rect = container.getBoundingClientRect();

        onDrag({
            xStart: downClick.x,
            yStart: downClick.y,
            x: clientX + container.scrollLeft - rect.left,
            y: clientY + container.scrollTop - rect.top,
        });
    }

    const onDrag = ({xStart, yStart, x, y}) => {
        clearTemplate();
        render(
            '#calendar',
            calendarEntry(yStart, y, true)
        );
    }

    const onDragEnd = ({xStart, yStart, x, y}) => {
        clearTemplate();
        render('#calendar', calendarEntry(yStart, y, false));
    }

    const initialPaint = () => {
        drawCustomerOrganizationSelect();
        setInitialDateOnDatePicker();

        [...new Array(24)].forEach((_, hour) => render("#calendar", calendarHour(hour)));

        const calendarContainer = document.querySelector('#calender-container');

        calendarContainer.addEventListener('mousedown', onMouseDown(calendarContainer));
        calendarContainer.addEventListener('mousemove', onMouseMove(calendarContainer));
        document.addEventListener('mouseup', onMouseUp(calendarContainer));
    }

    const drawCustomerOrganizationSelect = () => {
        const customer_organizations = Object.keys(customer_data);

        customer_organizations.forEach(id => { render("#customer-id",`<option value="${id}"> ${id} </option>`) })

        drawEmployeeSelect()
    }

    const setInitialDateOnDatePicker = () => {
        document.getElementById('date').valueAsDate = new Date();
    }

    const drawEmployeeSelect = () => {
        const customer_id = document.getElementById('customer-id').value;
        document.getElementById('employee-id').innerHTML = '';

        const employee_ids= customer_id ? Object.keys(customer_data[customer_id]) : []

        employee_ids.forEach(id => { render("#employee-id", `<option value="${id}"> ${id} </option>`)})
    }

    const clear_calendar_entries = () => {
        const elements = document.getElementsByClassName('calendar-entry');
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    const appointmentTitle = (y1, y2) => {
        let yStart = Math.min(y1, y2);
        let yEnd = Math.max(y1, y2);
        return `New appointment (${pixelsToTimeString(yStart)} - ${pixelsToTimeString(yEnd)})`;
    }

    const pixelsToTimeString = (pixel_value) => {
        let pixel_seconds = (24*60*60) / CALENDAR_HEIGHT;
        let selected_minutes = Math.round((pixel_seconds * pixel_value) / 60);
        return toHoursAndMinutes(selected_minutes);
    }

    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const customerId = () => {
        return document.getElementById('customer-id').value;
    }

    const employeeId = () => {
        return document.getElementById('employee-id').value;
    }

    const date = () => {
        return document.getElementById('date').value
    }

    document.addEventListener("DOMContentLoaded", initialPaint);
    document.querySelector('#button-clear')
        .addEventListener('click', () => {clear_calendar_entries()});
    document.documentElement.style
        .setProperty('--calendar-height', `${CALENDAR_HEIGHT}px`);
    document.querySelector('#customer-id').addEventListener("change", drawEmployeeSelect)
})()
