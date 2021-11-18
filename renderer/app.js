const { ipcRenderer } = require("electron");
const items = require("./items");

// DOM Nodes
let showModal = document.getElementById("show-modal");
let closeModal = document.getElementById("close-modal");
let modal = document.getElementById("modal");
let addItem = document.getElementById("add-item");
let itemUrl = document.getElementById("url");
let search = document.getElementById("search");

// Open modal from menu
ipcRenderer.on("menu-show-modal", () => {
	showModal.click();
});

// Open selected item from menu
ipcRenderer.on("menu-open-item", () => {
	items.open();
});

// Delete selected item from menu
ipcRenderer.on("menu-delete-item", () => {
	let selectedItem = items.getSelectedItem();
	items.delete(selectedItem.index);
});

// Open item in native browser from menu
ipcRenderer.on("menu-open-item-native", () => {
	items.openNative();
});

// Focus search input from menu
ipcRenderer.on("menu-focus-search", () => {
	search.focus();
});

// Filter items with "Search"
search.addEventListener("keyup", (e) => {
	// Loop items
	Array.from(document.getElementsByClassName("read-item")).forEach((item) => {
		// Hide items that doesn't match search value
		let hasMatch = item.innerText.toLowerCase().includes(search.value);
		item.style.display = hasMatch ? "flex" : "none";
	});
});

// Disable and enable modal buttons
const toggleModalButtons = () => {
	if (addItem.disabled) {
		addItem.disabled = false;
		addItem.style.opacity = 1;
		addItem.innerText = "Add Item";
		closeModal.style.display = "inline";
	} else {
		addItem.disabled = true;
		addItem.style.opacity = 0.5;
		addItem.innerText = "Adding...";
		closeModal.style.display = "none";
	}
};

// Show modal
showModal.addEventListener("click", (e) => {
	modal.style.display = "flex";
	itemUrl.focus();
});

// Hide modal
closeModal.addEventListener("click", (e) => {
	modal.style.display = "none";
});

// Handle new items being added
addItem.addEventListener("click", (e) => {
	// Check a url exists
	if (itemUrl.value) {
		// Send new Item url to main process
		ipcRenderer.send("new-item", itemUrl.value);

		// Disable buttons
		toggleModalButtons();
	}
});

// Listen for keyboard submit
itemUrl.addEventListener("keyup", (e) => {
	if (e.key == "Enter") addItem.click();
});

// Navigate item selection with up/down arrows
document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowUp" || e.key === "ArrowDown") {
		items.changeSelection(e.key);
	}
});

// Listen for new item from main process
ipcRenderer.on("new-item-success", (e, newItem) => {
	// Add new item to "items" node
	items.addItem(newItem, true);

	// Enable buttons
	toggleModalButtons();

	// Hide Modal and clear input
	modal.style.display = "none";
	itemUrl.value = "";
});
