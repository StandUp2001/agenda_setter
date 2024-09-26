"use strict";
chrome.action.onClicked.addListener((tab) => {
    // Do something when the extension is clicked
    console.log("Extension icon clicked!");
    if (!tab) {
        console.error("No tab found");
        return;
    }
    if (!tab.id) {
        console.error("No tab ID found");
        return;
    }
    // Example: Inject a script into the current tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const getDiv = () => {
                const divs = document.body.getElementsByTagName("div");
                const possible = [];
                for (let i = 0; i < divs.length; i++) {
                    const div = divs[i];
                    if (div.role !== "dialog")
                        continue;
                    possible.push(div);
                }
                if (possible.length !== 1) {
                    console.log("No dialogs found or multiple dialogs found");
                    return;
                }
                const div = possible[0];
                console.log("Possible dialogs found:", div);
                return div;
            };
            const ariaLabels = {
                "title": ["Add title and time", "Titel en tijd toevoegen"],
                "start": ["Start date", "Startdatum"],
                "stime": ["Start time", "Starttijd"],
                "etime": ["End time", "Eindtijd"],
                "end": ["End date", "Einddatum"],
                "day": ["All day", "Hele dag"],
                "guests": ["Guests", "Gasten"],
                "location": ["Add location", "Locatie toevoegen"],
                "description": ["Add description", "Beschrijving toevoegen"],
            };
            const isCorrect = (el, key) => {
                const label = el.getAttribute("aria-label");
                if (!label)
                    return false;
                const [en, nl] = ariaLabels[key];
                return label === en || label === nl;
            };
            const div = getDiv();
            if (!div)
                return;
            let textbox = null;
            const divs = div.getElementsByTagName("div");
            for (let i = 0; i < divs.length; i++) {
                const el = divs[i];
                if (el.getAttribute("role") === "textbox") {
                    textbox = el;
                    break;
                }
            }
            if (!textbox) {
                console.error("No textbox found");
                return;
            }
            if (isCorrect(textbox, "description")) {
                // TODO: Wachten op INFO
                textbox.innerHTML = "Hond naar de trimsalon gebracht";
            }
            const inputs = div.getElementsByTagName("input");
            for (let i = 0; i < inputs.length; i++) {
                const input_el = inputs[i];
                if (isCorrect(input_el, "title")) {
                    input_el.value = "[NAAM] naar de trimsalon";
                    continue;
                }
                if (isCorrect(input_el, "location")) {
                    input_el.value = "Pets Place Boerenbond, Schuttersveld 7-A, 7514 AC Enschede, Netherlands";
                    continue;
                }
                if (isCorrect(input_el, "day")) {
                    if (input_el.checked) {
                        input_el.click();
                    }
                    continue;
                }
            }
        }
    });
});
