chrome.action.onClicked.addListener((tab) => {
    if (!tab || !tab.id) {
        console.error("No tab found");
        return
    }

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {
            type Div = HTMLDivElement;
            type Input = HTMLInputElement;
            type Span = HTMLSpanElement;

            enum SearchType {
                ARIA_LABEL = "aria-label",
                DATA_KEY = "data-key"
            }

            class Language {
                en: string;
                nl: string;

                constructor(en: string, nl?: string) {
                    this.en = en;
                    this.nl = nl || en;
                }
            }

            const getRootDiv = () => {
                const divs = document.body.getElementsByTagName("div") as HTMLCollectionOf<Div>;
                const possible: Div[] = [];
                for (let i = 0; i < divs.length; i++) {
                    const div = divs[i];
                    if (div.role !== "dialog") continue;
                    possible.push(div);
                }
                if (possible.length !== 1) {
                    console.log("No dialogs found or multiple dialogs found");
                    return;
                }
                const div = possible[0];
                return div;
            }

            const aria_labels: { [key: string]: Language } = {
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

            const data_keys: { [key: string]: Language } = {
                "location": new Language("location"),
                "description": new Language("description"),
                "start": new Language("startDate"),
                "stime": new Language("startTime"),
                "etime": new Language("endTime"),
            };

            const ab_hours = new Language("hrs", "uur"); // This is for more than 1 hour

            function getElement<T>(search_element: string, search: string, search_type: SearchType = SearchType.ARIA_LABEL): T | null {
                if (!div) return null;
                let language: Language | undefined = undefined;
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
                const element = div.querySelector(`${search_element}[${search_type}="${language.en}"]`) as T | null;
                if (element) return element;
                return div.querySelector(`${search_element}[${search_type}="${language.nl}"]`) as T | null;
            }

            const div = getRootDiv();
            if (!div) return;

            // Title
            const title_el = getElement<Input>("input", "title");
            if (!title_el) return;
            title_el.value = "[NAAM] naar de trimsalon";

            // All day
            const day_el = getElement<Input>("input", "day");
            if (!day_el) return;
            if (day_el.checked) day_el.click();

            // Location
            const location_el = getElement<Span>("span", "location", SearchType.DATA_KEY);
            if (!location_el) return
            location_el.click();
            const location_input = getElement<Input>("input", "location");
            if (!location_input) return
            location_input.value = "Pets Place Boerenbond, Schuttersveld 7-A, 7514 AC Enschede, Netherlands";
            location_input.dispatchEvent(new Event("input", { bubbles: true }));

            // Description
            const description_el = getElement<Span>("span", "description", SearchType.DATA_KEY);
            if (!description_el) return
            description_el.click();
            const description_input = getElement<Div>("div", "description");
            if (!description_input) return
            description_input.dispatchEvent(new Event("input", { bubbles: true }));
            description_input.innerHTML = "<div>Naam van de klant: </div><div>Telefoonnummer: </div><div>Ras van de hond: </div><div>Vachttype: </div><div>Behandeling: </div><div>Evt medische gegevens: </div><div>Eventuele opmerkingen: </div><div><br></div><div>*Wij maken gebruik van een no-show beleid, dit houd in dat er kosten rekening gebracht kunnen worden als u niet komt opdagen of zich niet tijdig afmeld. Kijk de voorwaarden in de bijlage van deze pagina.</div>";

            // End time
            const end_time_el = getElement<Input>("input", "etime");
            if (!end_time_el) return;
            end_time_el.click();
            const div_options = getElement<Div>("div", "etime");
            if (!div_options) return;
            for (let i = 0; i < div_options.children.length; i++) {
                const child = div_options.children[i] as Div;
                const splitted = child.innerText.split(" ");
                const stripped = `${splitted[1]} ${splitted[2]}`;
                if (stripped === `(2 ${ab_hours.en})` || stripped === `(2 ${ab_hours.nl})`) {
                    console.log("Found 2 hours");
                    child.click();
                    break;
                }
            }
        }
    });
});
