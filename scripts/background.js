"use strict";
chrome.action.onClicked.addListener((tab) => {
    if (!tab || !tab.id) {
        console.error("No tab found");
        return;
    }
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            let SearchType;
            (function (SearchType) {
                SearchType["ARIA_LABEL"] = "aria-label";
                SearchType["DATA_KEY"] = "data-key";
            })(SearchType || (SearchType = {}));
            class Language {
                en;
                nl;
                constructor(en, nl) {
                    this.en = en;
                    this.nl = nl || en;
                }
            }
            const getRootDiv = () => {
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
                return div;
            };
            const aria_labels = {
                "title": new Language("Add title and time", "Titel en tijd toevoegen"),
                "start": new Language("Start date", "Startdatum"),
                "stime": new Language("Start time", "Starttijd"),
                "etime": new Language("End time", "Eindtijd"),
                "end": new Language("End date", "Einddatum"),
                "day": new Language("All day", "Hele dag"),
                "guests": new Language("Guests", "Gasten"),
                "location": new Language("Add location", "Locatie toevoegen"),
                "description": new Language("Add description", "Beschrijving toevoegen"),
            };
            const data_keys = {
                "location": new Language("location"),
                "description": new Language("description"),
            };
            function getElement(el, search_element, search, search_type = SearchType.ARIA_LABEL) {
                if (!el)
                    return null;
                let language = undefined;
                switch (search_type) {
                    case SearchType.ARIA_LABEL:
                        language = aria_labels[search];
                        break;
                    case SearchType.DATA_KEY:
                        language = data_keys[search];
                        break;
                    default:
                        console.error("Unknown search type", search_type);
                        return null;
                }
                if (!language) {
                    console.error("Search not found", search);
                    return null;
                }
                const element = el.querySelector(`${search_element}[${search_type}="${language.en}"]`);
                if (element)
                    return element;
                return el.querySelector(`${search_element}[${search_type}="${language.nl}"]`);
            }
            const div = getRootDiv();
            if (!div)
                return;
            // Title
            const title_el = getElement(div, "input", "title");
            if (!title_el)
                return;
            title_el.value = "[NAAM] naar de trimsalon";
            // Location
            const location_el = getElement(div, "span", "location", SearchType.DATA_KEY);
            if (!location_el)
                return;
            location_el.click();
            const location_input = getElement(div, "input", "location");
            if (!location_input)
                return;
            location_input.value = "Pets Place Boerenbond, Schuttersveld 7-A, 7514 AC Enschede, Netherlands";
            location_input.dispatchEvent(new Event("input", { bubbles: true }));
            // Description
            const description_el = getElement(div, "span", "description", SearchType.DATA_KEY);
            if (!description_el)
                return;
            description_el.click();
            const description_input = getElement(div, "div", "description");
            if (!description_input)
                return;
            description_input.dispatchEvent(new Event("input", { bubbles: true }));
            description_input.innerHTML = "<div>Naam van de klant: [KLANT]</div><div>Telefoonnummer: [NUMMER]</div><div>Ras van de hond: [RAS]</div><div>Vachttype: [TYPE]</div><div>Behandeling: [BEHANDELING]</div><div>Evt medische gegevens: [MEDISCHE]</div><div>Eventuele opmerkingen: [OPMERKING]</div><div><br></div><div>*Wij maken gebruik van een no-show beleid, dit houd in dat er kosten rekening gebracht kunnen worden als u niet komt opdagen of zich niet tijdig afmeld. Kijk de voorwaarden in de bijlage van deze pagina.</div>";
            // All day
            const day_el = getElement(div, "input", "day");
            if (!day_el)
                return;
            if (day_el.checked)
                day_el.click();
        }
    });
});
