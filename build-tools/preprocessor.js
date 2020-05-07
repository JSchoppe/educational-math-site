// These build tools require node.js to be installed on your machine.
const FileSystem = require("fs");
const Path = require("path");

// Run this with node to generate the build files for the website.
// Settings:
const MINIFY_JS = false;
const MINIFY_CSS = false;
const STRIP_LOCAL_HTML_EXTENSIONS = true;
const BUILD_DIRECTORY = ".." + Path.sep + "build" + Path.sep;
const SOURCE_DIRECTORY = ".." + Path.sep + "root" + Path.sep;
// Used to disclude template or source quality files:
const DISCLUDE_DIRECTORY_FROM_BUILD = /\/\*DONT_BUILD_FOLDER\*\//g; //--> /*DONT_BUILD_FOLDER*/
// Settings related to template filling logic.
const TEMPLATE_DEF_PREFIX = /\/\*TEMPLATE_BEGIN\(\S+\)\*\//g;       //--> /*TEMPLATE_BEGIN(name)*/
const TEMPLATE_DEF_SUFFIX = /\/\*TEMPLATE_END\*\//g;                //--> /*TEMPLATE_END*/
const TEMPLATE_FILL_CALL = /\/\*GET_TEMPLATE\(\S+\)\*\//g;          //--> /*GET_TEMPLATE(name)*/

// Expressions used internally.
const FROM_PARENTHESES = /(?<=\()\S+(?=\))/; // Matches the content inside a set of parentheses.
const HTML_HREF = /href\s*=\s*('|")\S+\.html('|")/g; // Matches an href property pointing to html.

// Check for the existence of the neccasary directories.
if(!FileSystem.existsSync(SOURCE_DIRECTORY))
    throw new Error("Source directory not found");
// Clear or create the build directory.
if(FileSystem.existsSync(BUILD_DIRECTORY))
{
    console.log("Found build directory, clearing prior build files");
    clearDir(BUILD_DIRECTORY);
}
else
    FileSystem.mkdirSync(BUILD_DIRECTORY);

console.log("Parsing template definitions");

// FIRST PASS: Gather template data, identify files that shouldn't be built.
const templateDefinitions = {};
const ignoredDirectories = {};
// Iterate through the source directory to find the template definitions.
for(filePath of getFilePathsRecursive(SOURCE_DIRECTORY))
{
    const content = FileSystem.readFileSync(filePath, { encoding: "utf8" });

    // Remember to not copy this file to the final build.
    if(DISCLUDE_DIRECTORY_FROM_BUILD.exec(content))
    {
        ignoredDirectories[Path.dirname(filePath)] = true;
    }

    // Is there template data to be parsed?
    const prefixes = getAllRegexMatches(content, TEMPLATE_DEF_PREFIX);
    const suffixes = getAllRegexMatches(content, TEMPLATE_DEF_SUFFIX);
    if(prefixes || suffixes)
    {
        // Check for errors in the templating syntax.
        if(prefixes === null || suffixes === null)
            throw new Error("Not every template in file has a clear start and end: " + filePath);
        if(prefixes.length !== suffixes.length)
            throw new Error("Not every template in file has a clear start and end: " + filePath);
        for(let i = 0; i < prefixes.length; i++)
            if(prefixes[i].startIndex > suffixes[i].startIndex)
                throw new Error("Template starts/ends are out of order: " + filePath);

        // Extract the template data.
        for(let j = 0; j < prefixes.length; j++)
        {
            const key = FROM_PARENTHESES.exec(prefixes[j].text);
            if(templateDefinitions[key])
                throw new Error("Template \"" + key + "\" is defined in multiple places");
            templateDefinitions[key] = content.slice(prefixes[j].endIndex, suffixes[j].startIndex);
        }
    }
}

console.log("Filling template requests inside templates");

// Fill templates within templates:
const templateNames = Object.getOwnPropertyNames(templateDefinitions);
let unsolvedCount = 0;
let isSolved = {};
for(name of templateNames)
{
    isSolved[name] = false;
    unsolvedCount++;
}
while(unsolvedCount > 0)
{
    const startUnsolved = unsolvedCount;
    for(template of templateNames)
    {
        if(!isSolved[template])
        {
            const templateRequests = getAllRegexMatches(templateDefinitions[template], TEMPLATE_FILL_CALL);
            if(templateRequests)
            {
                // Work backwards so the match indices are not offset.
                let allRequestsSolved = true;
                for(let i = templateRequests.length - 1; i >= 0; i--)
                {
                    const key = FROM_PARENTHESES.exec(templateRequests[i].text);
                    if(templateDefinitions[key] === null)
                        throw new Error("Template \"" + template + "\" requested nonexistant template: " + key);
                    if(isSolved[key])
                    {
                        // Remove the request, and insert the template.
                        templateDefinitions[template] = templateDefinitions[template].slice(0, templateRequests[i].startIndex) + 
                            templateDefinitions[key] +
                            templateDefinitions[template].slice(templateRequests[i].endIndex);
                    }
                    else
                        allRequestsSolved = false;
                }
                if(allRequestsSolved)
                {
                    isSolved[template] = true;
                    unsolvedCount--;
                }
            }
            else
            {
                isSolved[template] = true;
                unsolvedCount--;
            }
        }
    }
    // If nothing can be solved there are circular references.
    if(startUnsolved === unsolvedCount)
    {
        let circularPerpetrators = "";
        for(name of Object.getOwnPropertyNames(templateDefinitions))
            if(!isSolved[name])
                circularPerpetrators += name + " ";
        throw new Error("Templates unsolvable due to circular references: " + circularPerpetrators);
    }
}

console.log("Templates completed, processing source directory");

// SECOND PASS: Clone files into build directory, fill template requests, strip extensions.
buildDirectoryRecursive(SOURCE_DIRECTORY, "");
function buildDirectoryRecursive(path, buildPath)
{
    const directory = getFilesAndFolders(path);
    for(file of directory.files)
    {
        let content = FileSystem.readFileSync(file, { encoding: "utf8" });
        content = fillTemplateRequests(content);
        FileSystem.writeFileSync(Path.join(BUILD_DIRECTORY, buildPath, Path.basename(file)), content);
    }
    for(folder of directory.folders)
    {
        if(ignoredDirectories[folder]){}
        else
        {
            const relativeFolder = folder.replace(SOURCE_DIRECTORY, "");
            FileSystem.mkdirSync(Path.join(BUILD_DIRECTORY, relativeFolder));
            buildDirectoryRecursive(folder, relativeFolder);
        }
    }
}
function fillTemplateRequests(content)
{
    const templateRequests = getAllRegexMatches(content, TEMPLATE_FILL_CALL);
    if(templateRequests)
    {
        // Work backwards so the match indices are not offset.
        for(let i = templateRequests.length - 1; i >= 0; i--)
        {
            const key = FROM_PARENTHESES.exec(templateRequests[i].text);
            if(templateDefinitions[key] === null)
                throw new Error("A file requested a nonexistant template: " + key);

            // Remove the request, and insert the template.
            content = content.slice(0, templateRequests[i].startIndex) + 
                templateDefinitions[key] +
                content.slice(templateRequests[i].endIndex);
        }
    }
    return content;
}

console.log("Process completed with no errors");


// Utility functions:
function clearDir(path)
{
    for(directoryListing of FileSystem.readdirSync(path, { withFileTypes: true }))
    {
        const fullPath = Path.join(path, directoryListing.name);
        if(directoryListing.isDirectory())
        {
            clearDir(fullPath);
            FileSystem.rmdirSync(fullPath);
        }
        else if(directoryListing.isFile())
        {
            FileSystem.unlinkSync(fullPath);
        }
    }
}
function getFilePathsRecursive(path)
{
    const filePaths = [];
    for(directoryListing of FileSystem.readdirSync(path, { withFileTypes: true }))
    {
        const fullPath = Path.join(path, directoryListing.name);
        if(directoryListing.isDirectory())
        {
            const subFiles = getFilePathsRecursive(fullPath);
            filePaths.push(...subFiles);
        }
        else if(directoryListing.isFile())
        {
            filePaths.push(fullPath);
        }
    }
    return filePaths;
}
function getFilesAndFolders(path)
{
    const filePaths = [];
    const folderPaths = [];
    for(directoryListing of FileSystem.readdirSync(path, { withFileTypes: true }))
    {
        const fullPath = Path.join(path, directoryListing.name);
        if(directoryListing.isDirectory())
        {
            folderPaths.push(fullPath);
        }
        else if(directoryListing.isFile())
        {
            filePaths.push(fullPath);
        }
    }
    return {
        files: filePaths,
        folders: folderPaths
    };
}
function getAllRegexMatches(content, regex)
{
    // Prevent an infinite loop case if global is forgotten.
    regex.global = true;

    const matches = [];
    let match;
    // Iterate through the matches.
    while((match = regex.exec(content)))
    {
        // Push the match data.
        matches.push({
            text: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length
        });
    }
    regex.lastIndex = 0;
    return (matches.length > 0)? matches : null;
}