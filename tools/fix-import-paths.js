const fs = require("fs");
const path = require("path");


// Grabbing launch arguments
if(process.argv.length !== 3) {
	console.error('!> Invalid syntax !');
	console.error('Use: node fix-import-path.js <input_dir>');
	process.exit(1);
}

const inputDirectory = process.argv[2];


// Listing all the files that will be processed
// Source: https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
const getAllFiles = function(dirPath, arrayOfFiles) {
	let files = fs.readdirSync(dirPath);
	arrayOfFiles = arrayOfFiles || [];
	files.forEach(function(file) {
		if (fs.statSync(dirPath + "/" + file).isDirectory()) {
			arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
		} else {
			// This part of the function was broken !
			arrayOfFiles.push(path.join(dirPath, "/", file));
		}
	})
	return arrayOfFiles;
}

let filesToProcess = getAllFiles(inputDirectory, null).filter(filepath => filepath.endsWith(".js"));


// Preparing other stuff
let fileExtensionFixedCount = 0;
let filePathFixedCount = 0;


// Fixing the files
for(const fileToProcess of filesToProcess) {
	//console.log("> Processing '"+fileToProcess+"'");
	
	const inputFileLines = fs.readFileSync(fileToProcess).toString().split("\n");
	
	if(inputFileLines == null) {
		console.error('!> Failed to read lines !');
		process.exit(2);
	}
	
	const outputFileLines = [];
	
	for(let inputLine of inputFileLines) {
		if(inputLine.startsWith("import") && inputLine.includes("from")) {
			inputLine = inputLine.split(/['"]+/);
			
			//console.log(inputLine);
			
			if(!(inputLine[inputLine.length - 2].startsWith("./") || inputLine[inputLine.length - 2].startsWith("../"))) {
				inputLine[inputLine.length - 2] = "./" + inputLine[inputLine.length - 2];
				filePathFixedCount++;
			}
			
			if(!inputLine[inputLine.length - 2].endsWith(".js")) {
				inputLine[inputLine.length - 2] = inputLine[inputLine.length - 2] + ".js";
				fileExtensionFixedCount++;
			}
			
			inputLine = inputLine.join("\"");
		}
		outputFileLines.push(inputLine);
	}
	
	try {
		fs.unlinkSync(fileToProcess);
		fs.writeFileSync(fileToProcess, outputFileLines.join("\n"), "utf8");
	} catch(err) {
		console.error(err);
	}
}

console.log("> Fixed "+filePathFixedCount+" import path(s) !");
console.log("> Fixed "+fileExtensionFixedCount+" file extension(s) !");