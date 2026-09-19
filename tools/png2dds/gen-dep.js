// Generate a .dep (GameDependencyData) file from a Mod.Art.xml (GameArtSpecification).
// ModBuddy's own "Build" didn't emit this file for our project, but a real shipped mod's
// .dep is a mechanical, tag-renamed transform of its own Art.xml (verified against
// "Hololive 1st Generation.dep" vs its Mod.Art.xml: id->ID, artConsumers->SystemDependencies
// (consumerName->ConsumerName, relativeArtDefPaths->ArtDefDependencyPaths,
// libraryDependencies->LibraryDependencies, loadsLibraries->LoadsLibraries),
// gameLibraries->LibraryDependencies (libraryName->LibraryName,
// relativePackagePaths->PackageDependencies), requiredGameArtIDs->RequiredGameArtIDs.
const fs = require('fs');
const path = require('path');

const artXmlPath = process.argv[2];
const outPath = process.argv[3];
if (!artXmlPath || !outPath) {
  console.error('Usage: node gen-dep.js <Mod.Art.xml> <out.dep>');
  process.exit(1);
}

let xml = fs.readFileSync(artXmlPath, 'utf8');

xml = xml.replace(/<AssetObjects::GameArtSpecification>/, '<AssetObjects..GameDependencyData>');
xml = xml.replace(/<\/AssetObjects::GameArtSpecification>/, '</AssetObjects..GameDependencyData>');

xml = xml.replace(/<id>\s*\n(\s*<name text="[^"]*"\/>)\s*\n(\s*<id text="[^"]*"\/>)\s*\n\s*<\/id>/,
  (m, nameLine, idLine) => `<ID>\n${nameLine}\n${idLine}\n\t</ID>`);

xml = xml.replace(/<artConsumers>/, '<SystemDependencies>');
xml = xml.replace(/<\/artConsumers>/, '</SystemDependencies>');
xml = xml.replace(/<consumerName /g, '<ConsumerName ');
xml = xml.replace(/<relativeArtDefPaths>/g, '<ArtDefDependencyPaths>');
xml = xml.replace(/<relativeArtDefPaths\/>/g, '<ArtDefDependencyPaths/>');
xml = xml.replace(/<\/relativeArtDefPaths>/g, '</ArtDefDependencyPaths>');
xml = xml.replace(/<libraryDependencies>/g, '<LibraryDependencies>');
xml = xml.replace(/<libraryDependencies\/>/g, '<LibraryDependencies/>');
xml = xml.replace(/<\/libraryDependencies>/g, '</LibraryDependencies>');
xml = xml.replace(/<loadsLibraries>/g, '<LoadsLibraries>');
xml = xml.replace(/<\/loadsLibraries>/g, '</LoadsLibraries>');

// Real .dep files also have an <ArtDefDependencies> section (artdef-to-artdef graph,
// computed by the cooker from the .artdef files themselves) between SystemDependencies
// and the gameLibraries-derived LibraryDependencies. We ship no ArtDefs, so it's empty.
xml = xml.replace(/<\/SystemDependencies>/, '</SystemDependencies>\n\t<ArtDefDependencies/>');

xml = xml.replace(/<gameLibraries>/, '<LibraryDependencies>');
xml = xml.replace(/<\/gameLibraries>/, '</LibraryDependencies>');
xml = xml.replace(/<libraryName /g, '<LibraryName ');
xml = xml.replace(/<relativePackagePaths>/g, '<PackageDependencies>');
xml = xml.replace(/<relativePackagePaths\/>/g, '<PackageDependencies/>');
xml = xml.replace(/<\/relativePackagePaths>/g, '</PackageDependencies>');

xml = xml.replace(/<requiredGameArtIDs>/, '<RequiredGameArtIDs>');
xml = xml.replace(/<\/requiredGameArtIDs>/, '</RequiredGameArtIDs>');

// Real .dep files order this right after <ID>, but Art.xml has it last; move it up.
const reqMatch = xml.match(/\t<RequiredGameArtIDs>[\s\S]*?<\/RequiredGameArtIDs>\n/);
if (reqMatch) {
  xml = xml.replace(reqMatch[0], '');
  xml = xml.replace(/(<\/ID>\n)/, `$1${reqMatch[0]}`);
}

fs.writeFileSync(outPath, xml);
console.log(outPath);
