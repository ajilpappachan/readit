// Modules
const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

// Enable logging with electron-log
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

// Disable auto downloading of update
autoUpdater.autoDownload = false;

// Single export to check for and apply any available updates
module.exports = () => {
	// Check for update (GH Releases)
	autoUpdater.checkForUpdates();

	// Listen for update found
	autoUpdater.on("update-available", () => {
		// Prompt user to start download
		dialog
			.showMessageBox({
				type: "info",
				title: "Update Available",
				message:
					"A new version of Readit is available. Do you want to update now?",
				buttons: ["Update", "No"],
			})
			.then((result) => {
				let buttonIndex = result.response;

				// If button 0 (update), start downloading the update
				if (buttonIndex === 0) autoUpdater.downloadUpdate();
			});
	});

	// Listen for update donwloaded
	autoUpdater.on("update-downloaded", () => {
		// Prompt the user to install the update
		dialog
			.showMessageBox({
				type: "info",
				title: "Update Ready",
				message: "Install and restart now?",
				buttons: ["Install Now", "No"],
			})
			.then((result) => {
				let buttonIndex = result.response;

				// If button 0 (Yes), Install and restart
				if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
			});
	});
};
