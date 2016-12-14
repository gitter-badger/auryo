import {screen} from "electron";


export function posCenter(options) {

    const displays = screen.getAllDisplays();

    if (displays.length > 1) {
        const x = (displays[0].workArea.width - options.width) / 2;
        const y = (displays[0].workArea.height - options.height) / 2;
        options.x = x + displays[0].workArea.x;
        options.y = y + displays[0].workArea.y;
    }

    return options;
}