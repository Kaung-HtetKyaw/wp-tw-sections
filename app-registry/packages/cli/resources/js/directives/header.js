// Insert x-header to the header to get the height of the header in Alpine store and set it as a CSS variable

document.addEventListener('alpine:init', () => {
  Alpine.store('header', {
    height: 0,
    isScrollDown: false,
    setScrollDown(scrollDown) {
      this.isScrollDown = scrollDown;
    },
    setHeight(height) {
      this.height = height;
    },
  })

  Alpine.directive('header', (el) => {
    const header = el;

    const observer = new ResizeObserver((entries) => {
        // Handle resize event
        const entry = entries[0];
        let height = entry.contentRect.height;
    
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );

        Alpine.store('header').setHeight(height);
    }); 
    
    observer.observe(header); 

    let prevScroll = window.scrollY;
    window.addEventListener('scroll', () => {
        let currentScroll = window.scrollY;
        console.log(currentScroll, prevScroll);
        if (prevScroll > currentScroll) {
          Alpine.store('header').setScrollDown(false);
        } else {
          Alpine.store('header').setScrollDown(true);
        }
        prevScroll = currentScroll <= 0 ? 0 : currentScroll;
    })
  })
});
