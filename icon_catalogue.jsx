//DESCRIPTION: Create icon catalogue
// Peter Kahrel -- www.kahrel.plus.com


#target indesign;
#targetengine 'session';

main ();

function main ()
	{
	var w = new Window ('palette');
	var message = w.add ('statictext {characters: 30}');
	w.show();
	
	message.text = 'Locating icons...';
	var icons = find_files (Folder.appPackage + "/Plug-Ins", []);
	icons = find_files (Folder.appPackage + "/(InDesign Resources)", icons);
	
	w.text = icons.length + ' icons';

	var story = app.documents.add ().textFrames.add ({geometricBounds: [0,0,"100mm","100mm"]}).parentStory;


	for (var i = 0; i < icons.length; i++)
		{
		message.text = File (icons[i]).name;
		try
			{
			story.insertionPoints[-1].place (File (icons[i]))[0].parent.applyObjectStyle (app.documents[0].objectStyles[1]);
			story.insertionPoints[-1].contents = "\t" + icons[i] + "\r";
			}
		catch (_) {$.writeln ("Problem processing " + icons[i])}
		}

	app.findTextPreferences = app.changeTextPreferences = null;
	app.findTextPreferences.findWhat = decodeURI (Folder.appPackage);
	app.changeTextPreferences.changeTo = "";
	app.documents[0].changeText ();
	story.insertionPoints[0].contents = "Parent folder: " + decodeURI (Folder.appPackage) + "\r\r";

	try {w.close()} catch (_) {}
	}


function find_files (dir, array)
    {
    var f = Folder (dir).getFiles ("*.*");
    for (var i = 0; i < f.length; i++)
        if (f[i] instanceof Folder)
            find_files (f[i], array);
        else
            if (f[i].path.indexOf ("idrc_PNG") > -1)
                array.push (f[i].fullName);
    return array;
    }