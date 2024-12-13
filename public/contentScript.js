(function () {
  let renderedPanelTaskId = 0;

  const loadCSS = () => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = chrome.runtime.getURL("contentScript.css"); // Path to the CSS file
    document.head.appendChild(link);
  };

  const renderPanels = (linkedDevices, unlinkedDevices, taskId) => {
    let panel = document.querySelector("#itsware-panel");

    if (!panel) {
      const container = document.querySelector(
        ".cu-task-hero-section__task-properties__container"
      );
      panel = document.createElement("div");
      panel.id = "itsware-panel";
      container.insertAdjacentElement("afterend", panel);
    } else {
      panel.innerHTML = ""; // Clear existing content
    }

    // Left panel: Linked devices
    const leftPanel = document.createElement("div");
    leftPanel.classList.add("itsware-left-panel");
    leftPanel.innerHTML = `
      <div class="itsware-device-item-section">
        <h3>Linked Devices</h3>
        <button id="add-device-btn" class="add-device-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/></svg>
        </button>
      </div>
      
      <ul id="linked-devices">
        ${linkedDevices
          .map(
            (device) => `
          <li class="itsware-device-item">
            <div class="itsware-device-item-section">
              <div class="itsware-device-item-title">${device.name}</div>
              <div class="itsware-device-item-actions">
                <button data-device-id="${device.id}" class="unlink-button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18"><path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"/></svg>
                </button>
                <button data-device-id="${device.id}" data-is-watching="${
              device.isWatching
            }" class="watch-button">
                  ${
                    device.isWatching
                      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="18" height="18"><path d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"/></svg>'
                      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="18" height="18"><path d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"/></svg>'
                  }
                </button>
              </div>
            </div>
            <div class="itsware-device-item-section">
              <div class="itsware-device-item-label">${device.cabinet}</div>
              <div class="itsware-device-item-label">${new Date(
                device.createdAt
              ).toLocaleDateString()}</div>
            </div>
          </li>`
          )
          .join("")}
      </ul>
    `;

    panel.appendChild(leftPanel);

    // Modal for unlinked devices
    const modal = document.createElement("div");
    modal.id = "itsware-device-modal";
    modal.classList.add("modal");
    modal.innerHTML = `
      <div class="modal-content">
        <input type="text" id="device-search" class="search-box" placeholder="Search for devices..." />
        <ul id="unlinked-devices">
          ${unlinkedDevices
            .map(
              (device) => `
            <li class="itsware-device-item" data-device-id="${device.id}">
              ${device.name}
            </li>`
            )
            .join("")}
        </ul>
      </div>
    `;
    document.body.appendChild(modal);

    // Add event listeners for unlink buttons
    document.querySelectorAll(".unlink-button").forEach((button) => {
      button.addEventListener("click", () => {
        const deviceId = button.dataset.deviceId;
        updateDevice(taskId, deviceId, false, false);
      });
    });

    // Add event listeners for watch/unwatch buttons
    document.querySelectorAll(".watch-button").forEach((button) => {
      button.addEventListener("click", () => {
        const deviceId = button.dataset.deviceId;
        updateDevice(
          taskId,
          deviceId,
          !JSON.parse(button.dataset.isWatching),
          true
        );
      });
    });

    // Add event listener for add device button
    document.querySelector("#add-device-btn").addEventListener("click", () => {
      modal.style.display = "flex"; // Open modal with fade-in effect
      modal.classList.add("fade-in");
    });

    // Add event listener for device selection in the modal
    document
      .querySelectorAll("#unlinked-devices .itsware-device-item")
      .forEach((item) => {
        item.addEventListener("click", () => {
          const deviceId = item.dataset.deviceId;
          updateDevice(taskId, deviceId, false, true); // Link the device
          modal.style.display = "none"; // Close modal
          modal.classList.remove("fade-in");
        });
      });

    // Add event listener for closing the modal when clicking outside of it
    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.style.display = "none";
        modal.classList.remove("fade-in");
      }
    });

    // Search box functionality for filtering devices
    const searchInput = document.querySelector("#device-search");
    searchInput.addEventListener("input", (event) => {
      const searchQuery = event.target.value.toLowerCase();
      const deviceItems = document.querySelectorAll(
        "#unlinked-devices .itsware-device-item"
      );

      deviceItems.forEach((item) => {
        console.log(item, item.textContent, 'asdfasd');
        const deviceName = item.textContent.toLowerCase();
        item.style.display = deviceName.includes(searchQuery)
          ? "block"
          : "none";
      });
    });
  };

  const fetchDevices = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/devices?task_id=${taskId}`
      );
      const data = await response.json();
      renderPanels(data.linkedDevices, data.unlinkedDevices, taskId);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const updateDevice = async (taskId, deviceId, isWatching, isLinkedToTask) => {
    try {
      await fetch("http://localhost:3000/devices/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task_id: taskId,
          device_id: deviceId,
          isWatching,
          isLinkedToTask,
        }),
      });
      fetchDevices(taskId); // Refresh the panels
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  const observeTaskPage = () => {
    const observer = new MutationObserver(() => {
      const taskId = window.location.pathname.split("/").pop();
      if (window.location.pathname.startsWith("/t/")) {
        if (
          document.querySelector(
            ".cu-task-hero-section__task-properties__container"
          ) &&
          renderedPanelTaskId !== taskId
        ) {
          renderedPanelTaskId = taskId;
          fetchDevices(taskId);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  window.addEventListener("load", () => {
    loadCSS(); // Inject the CSS file
    observeTaskPage();
  });
})();
