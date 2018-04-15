/**
 * @title README Generator
 * @description Auto-generate a beautiful README for a project based on its code comments.
 * This very README was generated from readme-generator!
 * @installation
 * ```
 * npm install readme-generator
 * ```
 * @author ethancrist
 **/
const fs = require('fs')
const parser = require('comment-parser')
        
var files = ['core.js'];
var mainFile = 'core.js';

fs.readFile(process.argv[2], 'utf8', function(err, data) {
    return err ? console.log(err) : createReadme(parser(data))
});


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

function createReadme(metadata, code) {
    var appData = getAppData(metadata); 

    // Fallbacks
    appData.title = appData.title ? '# '+appData.title+'\n\n' : '';
    appData.logo = appData.logo ? '![logo]('+appData.logo+')\n\n' : '';
    appData.description = appData.description ? appData.description+'\n\n' : '';
 
    // Stored in appData; we don't want it in our metadata any more
    metadata.splice(0, 1);

    var markdown = 
        appData.title+
        
        appData.logo+

        appData.description;

    if (appData.installation) markdown += '## Installation\n\n'+appData.installation+'\n\n';


    var variableData = getVariableData(metadata); 
    var variables = Object.keys(variableData);

    markdown += '## API\n\n';

    for (var f = 0; f < files.length; f++) { 
        for (var v = 0; v < variables.length; v++) {
        	thisVarData = variableData[variables[v]];
        	
        	if (!thisVarData.meta) continue;

            markdown += '### [`'+variables[v]+'`]('+files[f]+'#L'+thisVarData.meta.line+')\n';

            var variableTags = Object.keys(thisVarData);
            for (var i = 0; i < variableTags.length; i++) {
                var thisTagKey = variableTags[i];
                var thisTagValue = thisVarData[thisTagKey];

                if (variableTags[i] === "meta") continue;

                markdown += '#### '+thisTagKey+' \n\n'+thisTagValue+'\n\n'
            }; 
            markdown += '\n'
        };
    };

    console.log(markdown);

    fs.writeFile('README.gen.md', markdown, (err) => {
        err ? console.log(err) : console.log('README.gen.md created.')
    }); 
}















