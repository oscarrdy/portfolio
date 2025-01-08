// Navbar class
class _Navbar {

    /*
     * Accepts the navbar element and the positioning type
    */
    constructor(element, type) {
        this.element = element;
        this.prev_scroll_pos = document.documentElement.scrollTop ?? window.scrollY;
        this.update_bound = this.update.bind(this);
        type === "scroll" ? this.set_pos_scroll() : type === "static" ? this.set_pos_static() : this.set_pos_fixed();
    }
    

    /*
     * Updates the navbar visibility based on the scroll position
    */
    update() {
      const cur_scroll_pos = document.documentElement.scrollTop ?? window.scrollY;
      this.prev_scroll_pos > cur_scroll_pos ? this.show() : this.hide();
      this.prev_scroll_pos = cur_scroll_pos;
    }
    
    
    /*
     * Configures the navbar to be statically shown at the top of the website
    */
    set_pos_static() {
      window.removeEventListener("scroll", this.update_bound);
      this.hide();
    }
    
    
    /*
     * Configures the navbar to be fixed at the top of the viewport
    */
    set_pos_fixed() {
      window.removeEventListener("scroll", this.update_bound);
      this.show();
    }
    
   
    /*
     * Configures the navbar to be shown when scrolling up and hidden when scrolling down
    */
    set_pos_scroll() {
      window.addEventListener("scroll", this.update_bound);
    }
    
    
    /*
     * Show the navbar
    */
    show() {
      this.element.classList.remove("hidden");
    }
    
    
    /*
     * Hide the navbar
    */
    hide() {
      this.element.classList.add("hidden");
    }
  
}



// Export
export default _Navbar;