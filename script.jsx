// Change this to your local folder. Must be an absolute path, although you can use an alias. Be sure to end folder names with a '/'
var rootFolder = "~/Documents/some-project-folder/";
var srcFolder = "svgs/"
var outputFolder = "converted/"

function getFiles() {
  var path = rootFolder + srcFolder;
  var folder = new Folder(path);
  if (folder.exists) {
    return folder.getFiles("*.svg");
  } else {
    throw("Unable to find folder at " + path);
  }
}

// This presumes that the icons are named "ICON__24.svg". Adjust to match your naming convention.
function getUnsizedIconName(name) {
  return name.toLowerCase().slice(0, name.indexOf('__'));
}

function saveFile(destination, name, document) {
  // String processing to extract the icon size from the file name (i.e., "24" from "ICON__24.svg")
  var iconSize = name.substr(name.lastIndexOf('.') - 2, 2);
  var folderPath = destination + iconSize + '/';
  var folder = new Folder(folderPath);
  if (!folder.exists) folder.create();
  var filePath = folderPath + getUnsizedIconName(name) + '.svg';
  var destFile = new File(filePath);
  var options = new ExportOptionsSVG();
  document.exportFile(destFile, ExportType.SVG, options);
}

function main() {
  try {
    var files = getFiles();
    for (var i = 0; i < files.length; i++) {
      // Open each file, process it, then close it before moving on.
      var file = files[i];
      var document = app.open(file);
      document.activate();
      expandFile();
      saveFile(rootFolder + outputFolder, document.name, document);
      document.close();
    }
  } catch(e) {
    alert(e);
  }
}

function expandFile() {
  // You can replace these menu commands with other Illustrator commands such as those at https://community.adobe.com/t5/illustrator/a-list-of-illustrator-menu-commands-we-can-call-from-javascript/td-p/7694367?page=1
  app.executeMenuCommand("selectall");
  app.executeMenuCommand("OffsetPath v22"); // Outline path
  app.executeMenuCommand("Live Pathfinder Merge"); // Shape union operation
  app.executeMenuCommand("expandStyle");
}

/*
 * Run script
 */
main();
