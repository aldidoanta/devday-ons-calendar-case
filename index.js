(function() {
    const render = (selector, template) => {
            document.querySelector(selector).insertAdjacentHTML('beforeend', template)
    }

    const calendarHour = (hour) => `
        <div class="hour">
            <div class="time"> ${hour.toString(10).padStart(2, '0')}:00 </div>
            <div class="appointments"></div>
        </div>
    `

    const calendarEntry = (yStart, yEnd, template, content = "") => {
        const y0 = yStart > yEnd ? yEnd : yStart;
        const y1 = yStart > yEnd ? yStart : yEnd;

        return `
            <div class="calendar-entry ${template ? "calendar-entry-template" : ""}" style="top:${y0}px; height: ${y1 - y0}px">
                ${content}
            </div>
        `
    }

    const clearTemplate = () => {
        const template = document.querySelector('.calendar-entry-template')
        template && template.remove()
    }

    let downClick = null;

    const onMouseDown = (container) => ({ clientX, clientY, target }) => {
        const rect = container.getBoundingClientRect()

        downClick = {
            x: clientX + container.scrollLeft - rect.left,
            y: clientY + container.scrollTop - rect.top,
        }
    }

    const onMouseUp = (container) => ({ clientX, clientY }) => {
        if (!downClick) return;
        const rect = container.getBoundingClientRect()

        onDragEnd({
            xStart: downClick.x,
            yStart: downClick.y,
            x: clientX + container.scrollLeft - rect.left,
            y: clientY + container.scrollTop - rect.top,
        })
        downClick = null;
    }

    const onMouseMove = (container) => ({ clientX, clientY }) => {
        if (!downClick) return;

        const rect = container.getBoundingClientRect()

        onDrag({
            xStart: downClick.x,
            yStart: downClick.y,
            x: clientX + container.scrollLeft - rect.left,
            y: clientY + container.scrollTop - rect.top,
        })
    }

    const onDrag = ({xStart, yStart, x, y}) => {
        console.log({
            xStart,
            yStart,
            x,
            y,
        })

        clearTemplate()
        render('#calendar', calendarEntry(yStart - (yStart % 15), y - (y % 15), true, `New appointment`))
    }

    const onDragEnd = ({xStart, yStart, x, y}) => {
        clearTemplate()
        render('#calendar', calendarEntry(yStart - (yStart % 15), y - (y % 15), false, `New appointment`))
    }

    const initialPaint = () => {
        [...new Array(24)].forEach((_, hour) => render("#calendar", calendarHour(hour)))

        const calendarContainer = document.querySelector('#calender-container')


        calendarContainer.addEventListener('mousedown', onMouseDown(calendarContainer))
        calendarContainer.addEventListener('mousemove', onMouseMove(calendarContainer))
        document.addEventListener('mouseup', onMouseUp(calendarContainer))
    }

    document.addEventListener("DOMContentLoaded", initialPaint)
})()