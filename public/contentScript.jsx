(function() {
  // Function to insert the header
  const insertHeader = () => {
    const customFieldsSection = document.querySelector('.cu-task-hero-section__task-properties__container');
    
    if (customFieldsSection) {
      // Check if "ItsWare" header already exists to prevent duplicate inserts
      if (!document.querySelector('#itsware-header')) {
        const header = document.createElement('h1');
        header.id = 'itsware-header';
        header.textContent = 'ItsWare';
        header.style.textAlign = 'center'; // Optional: styling for the header
        customFieldsSection.insertAdjacentElement('afterend', header); // Insert before Custom Fields section
      }
    }
  };

  // Function to check if the URL matches ClickUp task detail page
  const isTaskDetailPage = () => {
    return window.location.pathname.startsWith('/t/');
  };

  // Function to handle URL changes and DOM updates
  const observePageChanges = () => {
    const observer = new MutationObserver(() => {
      // Check if URL matches the task detail page and ensure the DOM is fully loaded
      if (isTaskDetailPage()) {
        insertHeader();
      }
    });

    // Observe changes in the URL and other DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  // Run when the page has loaded
  window.addEventListener('load', () => {
    console.log('Page loaded');
    if (isTaskDetailPage()) {
      insertHeader(); // Insert header if the user is connected
    }
    observePageChanges(); // Start observing for URL changes and DOM updates
  });

})();
