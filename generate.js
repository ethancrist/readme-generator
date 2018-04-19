/**
 * @title README Generator
 * @logo readme.gif
 * @description Auto-generate a beautiful README for a project based on its code comments.
 * This very README was generated from readme-generator!
 * Supports any language that uses star comments.
 * @installation
 * ```
 * npm i -g readme-generator
 * ```
 * @author ethancrist
 **/
const fs = require('fs')
const parser = require('comment-parser')

/**
 * @meta generate [command]
 * @purpose Generate a README using any child code files of the current directory.
 * @usage ```bash
 *        generate -m "<mainFile.js>" [ -i <ignore dir> ]
 *        ```
 * @options ##### `--mainFile`
 *          Alias: `-m` Type: `string` Required: `true`
 *
 *          The relative location of the main file to your code. This will be the file whose code comments supply application metadata.
 *
 *          ##### `--ignore`
 *          Alias: `-i` Type: `string` Required: `false`
 *
 *          Ignore a code file or a set of code files within a directory when creating the README. For example:
 *          ```bash
 *          generate -m mainFile.js -i ./node_modules`
 *          ```
 *          Would create documentation in the README for all files in the current directory and child directories EXCEPT anything in node_modules.
 **/

const optionDefinitions = [
	{ name: 'mainFile', alias: 'm', type: String },
	{ name: 'ignore', alias: 'i', multiple: true, type: String }
]
const options = require('command-line-args')(optionDefinitions)

// Cleaning user args if needed
for (var i = 0; i < options.ignore.length; i++) {
	if (options.ignore[i].charAt(0) != '/' && options.ignore[i].charAt(1) != '/') {
		// Auto-setting ignore file to current dir if no dir was specified
		options.ignore[i] = './'+options.ignore[i];
	}
}

// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, filelist) {
	var theseFiles = fs.readdirSync(dir);
	
	var	filelist = filelist || [];
		
	theseFiles.forEach(function(file) {		
		// Skipping --ignore folders and files 
		if (options.ignore.indexOf(dir+file) > -1 || ['README.MD', 'README.GEN.MD'].indexOf(file.toUpperCase()) > -1) return;
		
		if (fs.statSync(dir + file).isDirectory()) {
    		filelist = walkSync(dir + file + '/', filelist);
    	} else {
	    	console.log('Preparing README documentation for '+dir+file+'...')    	
      		filelist.push(file);
    	}
  	});
  	
  	return filelist;
};

// Entry
var files = walkSync('./');
createReadme();

function createReadme() {

	var markdown = '';

	fs.readFile(options.mainFile, 'utf8', function(err, data) {
		if (err) return console.log(err);
		
		var appData = getAppData(parser(data)); 

		// Fallbacks
		appData.title = appData.title ? '# '+appData.title+'\n\n' : '';
		appData.logo = appData.logo ? '![logo]('+appData.logo+')\n\n' : '';
		appData.description = appData.description ? appData.description+'\n\n' : '';


		markdown = 
			appData.title+
		
			appData.logo+

			appData.description;

		if (appData.installation) markdown += '## Installation\n\n'+appData.installation+'\n\n';

		markdown += '## API\n\n';

		files.forEach(function(file, index) {
			fs.readFile(file, 'utf8', function(subError, subData) {
				if (subError) return console.log(subError);
				
				markdown += getFileDoc(file, parser(subData));
			
				console.log('Creating README content for '+file+'...')
			
				if ((index + 1) === files.length) {
					console.log(markdown)
			
					// Last file done; writing README
					fs.writeFile('README.gen.md', markdown, (writeError) => {
						err ? console.log(writeError) : console.log('README.gen.md created.')
					});
				}
			});
		})
		
	});
}

function capitalize(word) {
	// Capitalize the first letter in a word
	return word.substring(0, 1).toUpperCase()+word.substring(1)  
}


function getTagText(tagData) {
    var tagTextStart = tagData.source.indexOf('@'+tagData.tag)+tagData.tag.length+2;
    var tagText = tagData.source.substring(tagTextStart);

    // Markdown requires two new lines to be visible
    // In some exceptions, we won't add a new line.
    var exceptions = ['installation'];
    return exceptions.indexOf(tagData.tag) > -1 ? tagText : tagText.replace('\n', '\n\n');
}

function getTags(tags) {
    var newTags = {};
    for (var i = 0; i < tags.length; i++) {
        // Normal tag; adding it as is
        var tagValues = Object.assign(getTagText(tags[i]), { line: tags[i].line-1 });
        newTags[tags[i].tag] = tagValues
    };
    return newTags
}

function getAppData(metadata) {
    var filtered = {};

    // Looping through all code comment tags
    for (var i = 0; i < metadata[0].tags.length; i++) {
        var thisTag = metadata[0].tags[i];

        filtered[thisTag.tag] = getTagText(thisTag)
    };
    return filtered
}

function getVariableData(metadata) {
    var variables = {};
    for (var i = 0; i < metadata.length; i++) {
        // Each loop here is a new /** **/ area
        var theseTags = metadata[i].tags;
        var thisTag = getTags(theseTags);

        variables[thisTag.meta] = thisTag
    };
    return variables
}

function getFileDoc(fileName, fileContents) {
    var variableData = getVariableData(fileContents); 
    var variables = Object.keys(variableData);

	var fileDoc = '';

	fileDoc += '###### ['+fileName+']('+fileName+')\n\n'; 

    for (var v = 0; v < variables.length; v++) {
    	thisVarData = variableData[variables[v]];
    	
    	if (!thisVarData.meta) continue;

        fileDoc += '### [`'+variables[v]+'`]('+fileName+'#L'+thisVarData.meta.line+')\n';

        var variableTags = Object.keys(thisVarData);
        for (var i = 0; i < variableTags.length; i++) {
            var thisTagKey = variableTags[i];
            var thisTagValue = thisVarData[thisTagKey];
			var line = thisVarData[thisTagKey].line+2;

            if (variableTags[i] === "meta") continue;

			// If the variable tag == one of these in the array, remove the title
			// for it above the description itself and just show the description
			var descriptionTags = ['purpose', 'describe', 'description'];
			thisTagKey = descriptionTags.indexOf(thisTagKey.toLowerCase()) > -1 ? '' : '#### '+capitalize(thisTagKey)+'\n\n';

            fileDoc += thisTagKey+thisTagValue+'\n\n'
        }; 
        fileDoc += '\n'
    };
    
    return fileDoc
}















