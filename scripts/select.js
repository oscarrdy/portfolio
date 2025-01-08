// Query Selectors
const SELECT_CONTAINER_CLASS = "select";
const SELECT_BUTTON_CLASS = "select__button";
const SELECT_LIST_CLASS = "select__list";
const SELECT_LIST_ITEM_CLASS = "select__list-item";
const SELECT_OPTION_CLASS = "select__option";

// Attributes
const OPEN_ATTRIBUTE = "data-open";
const VALUE_ATTRIBUTE = "data-value";
const DISABLED_ATTRIBUTE = "data-disabled";
const SELECTED_ATTRIBUTE = "data-selected";
const NAVIGATED_ATTRIBUTE = "data-navigated";



// Select Class
class _Select {

    /*
     * Accepts the HTMLElement of the custom select container
    */
    constructor(element) {
        
        // Get the required elements
        this.element = element;
        this.elementButton = element.querySelector(`.${ SELECT_BUTTON_CLASS }`);
        this.elementList = element.querySelector(`.${ SELECT_LIST_CLASS }`);

        // Get the options
        this.options = Array.from(this.elementList.querySelectorAll(`.${ SELECT_LIST_ITEM_CLASS }`)).map(option => {
            const optionObject = {
                element: option,
                value: option.getAttribute(VALUE_ATTRIBUTE),
                selected: option.hasAttribute(SELECTED_ATTRIBUTE),
                disabled: option.hasAttribute(DISABLED_ATTRIBUTE),
            }
            if (!optionObject.disabled) {
                option.addEventListener("click", () => {
                    this.select(optionObject);
                    this.close();
                });
            }
            return optionObject;
        });
        
        // Helpers
        this.searchedTerm = "";
        this.debounceTimeout = null;
        this.navigatedOption = null;
        this.selectedOption = this.options.find(option => option.element.hasAttribute(SELECTED_ATTRIBUTE));
        if (!this.selectedOption) {
            this.selectedOption = this.options[0];
            this.selectedOption.element.setAttribute(SELECTED_ATTRIBUTE, "");
        }
        this.lightClose = function(e) {
            if (!this.elementButton.contains(e.target)) {
                this.close();
            }
        }.bind(this);
        this.onSelect = null;

        // Click to open
        this.elementButton.addEventListener("click", () => {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        });
        
        // Keyboard events
        this.element.addEventListener("keydown", (e) => {
            if (!this.isOpen()) {
                switch (e.code) {
                    case "Enter":
                    case "Space": 
                    case "ArrowUp":
                    case "ArrowDown": {
                        e.preventDefault();
                        this.open();
                        break;
                    }
                }
            }
            else {
                switch (e.code) {
                    case "Enter": 
                    case "Space": {
                        e.preventDefault();
                        this.select(this.navigatedOption);
                        this.close();
                        break;
                    }
                    case "Escape": {
                        e.preventDefault();
                        this.close();
                        break;
                    }
                    case "Tab": {
                        e.preventDefault();
                        this.close();
                        break;
                    }
                    case "ArrowUp": {
                        e.preventDefault();
                        this.navigatedOption.element.removeAttribute(NAVIGATED_ATTRIBUTE);
                        this.navigatedOption = this.getPreviousOption(this.navigatedOption, this.options);
                        this.navigatedOption.element.setAttribute(NAVIGATED_ATTRIBUTE, "");
                        this.navigatedOption.element.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        break;
                    }
                    case "ArrowDown": {
                        e.preventDefault();
                        this.navigatedOption.element.removeAttribute(NAVIGATED_ATTRIBUTE);
                        this.navigatedOption = this.getNextOption(this.navigatedOption, this.options);
                        this.navigatedOption.element.setAttribute(NAVIGATED_ATTRIBUTE, "");
                        this.navigatedOption.element.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        break;
                    }
                    default: {
                        clearTimeout(this.debounceTimeout);
                        this.searchedTerm += e.key;
                        this.debounceTimeout = setTimeout(() => {
                            this.searchedTerm = "";
                        }, 500);
                        this.options.find(option => {
                            if (option.value.toLowerCase().startsWith(this.searchedTerm) && !option.disabled && !option.excludeFromSearch) {
                                this.navigatedOption.element.removeAttribute(NAVIGATED_ATTRIBUTE);
                                this.navigatedOption = option;
                                this.navigatedOption.element.setAttribute(NAVIGATED_ATTRIBUTE, "");
                                this.navigatedOption.element.scrollIntoView({ behavior: "smooth", block: "nearest" });
                                return true;
                            }
                        }); 
                        break;
                    }
                }
            }
        });   
    }



    /*
     * Accepts the option object to get the previous option from
     * Returns the previous option object
    */
    getPreviousOption(option, options) {
        const index = options.indexOf(option);
        if (index === 0) {
            return options[options.length - 1];
        }
        return options[index - 1];
    }



    /*
     * Accepts the option object to get the next option from
     * Returns the next option object
    */
    getNextOption(option, options) {
        const index = options.indexOf(option);
        if (index === options.length - 1) {
            return options[0];
        }
        return options[index + 1];
    }



    /*
     * Accepts the option object to be selected
    */ 
    select(option) {
        this.selectedOption.element.removeAttribute(SELECTED_ATTRIBUTE);
        this.selectedOption.element.setAttribute("aria-selected", "false");
        this.selectedOption = option;
        this.selectedOption.element.setAttribute(SELECTED_ATTRIBUTE, "");
        this.selectedOption.element.setAttribute("aria-selected", "true");
        this.elementButton.innerHTML = '';
        this.elementButton.appendChild(this.selectedOption.element.querySelector(`.${ SELECT_OPTION_CLASS }`).cloneNode(true));
        if (this.onSelect) {
            this.onSelect(this.selectedOption.value);
        }
    }


    /*
     * Opens the select dropdown
    */
    open() {
        this.element.setAttribute(OPEN_ATTRIBUTE, "");
        this.elementButton.setAttribute("aria-expanded", "true");
        this.navigatedOption = this.selectedOption;
        this.navigatedOption.element.setAttribute(NAVIGATED_ATTRIBUTE, "");
        document.addEventListener("click", this.lightClose);
    }


    /*
     * Closes the select dropdown
    */
    close() {
        this.element.removeAttribute(OPEN_ATTRIBUTE);
        this.elementButton.removeAttribute("aria-expanded");
        this.navigatedOption.element.removeAttribute(NAVIGATED_ATTRIBUTE);
        this.navigatedOption = null;
        document.removeEventListener("click", this.lightClose);
    }


    /*
     * Returns whether or not the select dropdown is open
    */
    isOpen() {
        return this.element.hasAttribute(OPEN_ATTRIBUTE);
    }

}



// Export
export default _Select;