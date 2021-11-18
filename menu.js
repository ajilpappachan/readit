// Modules
const { Menu, shell } = require("electron");

// Module function to create main app menu
module.exports = (appWindow) => {
	// Menu Template
	let template = [
		{
			label: "Items",
			submenu: [
				{
					label: "Add New",
					accelerator: "CmdOrCtrl+O",
					click: () => {
						appWindow.send("menu-show-modal");
					},
				},
				{
					label: "Read Item",
					accelerator: "CmdOrCtrl+Enter",
					click: () => {
						appWindow.send("menu-open-item");
					},
				},
				{
					label: "Delete Item",
					accelerator: "CmdOrCtrl+Backspace",
					click: () => {
						appWindow.send("menu-delete-item");
					},
				},
				{
					label: "Open in Browser",
					accelerator: "CmdOrCtrl+Shift+Enter",
					click: () => {
						appWindow.send("menu-open-item-native");
					},
				},
				{
					label: "Search Items",
					accelerator: "CmdOrCtrl+S",
					click: () => {
						appWindow.send("menu-focus-search");
					},
				},
			],
		},
		{
			role: "editMenu",
		},
		{
			role: "windowMenu",
		},
		{
			role: "help",
			submenu: [
				{
					label: "Learn More",
					click: () => {
						shell.openExternal("https://github.com/ajilpappachan/readit");
					},
				},
			],
		},
	];

	// Create Mac app menu
	if (process.platform === "darwin") template.unshift({ role: "appMenu" });

	// Build menu
	let menu = Menu.buildFromTemplate(template);

	// Set as main app menu
	Menu.setApplicationMenu(menu);
};
