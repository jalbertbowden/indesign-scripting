//DESCRIPTION: Create a report of all manually kerned character pairs
// Peter Kahrel -- www.kahrel.plus.com


#target indesign;

main ();

function main ()
	{
		
		function getAllChars (story)
			{ // Combine footnotes with their parent story
			var ch = story.characters.everyItem().getElements();
			var fn = story.footnotes.everyItem().getElements();
			for (var n = fn.length-1; n > -1; n--)
				ch = ch.concat (fn[n].characters.everyItem().getElements());
			return ch;
			}


		function GetChar (ch)
			{
			if (app.version[0] <= 6 && Specials[ch.contents] !== undefined)
				return Specials[ch.contents];
			if (String(ch.contents).length > 2)
				return String(ch.contents);
			switch (ch.capitalization)
				{
				case Capitalization.normal: return ch.contents;
				case Capitalization.allCaps: return ch.contents.toUpperCase();
				case Capitalization.smallCaps: return ch.contents+" (sc)";
				case Capitalization.capToSmallCap: return ch.contents+" (sc)";
				}
			}


	// BEGIN main
	
	if (app.version[0] <= 6 && app.activeDocument.modified)
		{
		alert ("Please save the document and start again.");
		exit();
		}
	
	OpenCopy();
	PrepareDocument();
	var Specials = initSpecials();
	var KernValues = [];
	var i, j, chars, charsLe, storiesLe;
	var stories = app.activeDocument.stories, kValues;
	var manual = app.translateKeyString ("$ID/Manual");
	storiesLe = stories.length-1;
	for (i = storiesLe; i > -1; i--)
		{
		chars = getAllChars (stories[i]);
		charsLe = chars.length-1;
		for (j = charsLe; j > -1; j--)
			{
			if (chars[j].kerningMethod == manual)
				{
				try
					{
					KernValues.push (GetChar(chars[j])+"\t"+
						GetChar(chars[j+1])+"\t"+
						chars[j].kerningValue+"\t"+
						chars[j].appliedFont.name+"\t"+
						chars[j+1].fontStyle)
					}catch(_){};
				}
			}
		}
	KernValues.sort();
	// Close the copy of the file
	app.activeDocument.close(SaveOptions.no);
	app.documents.add().textFrames.add ({geometricBounds: ["36pt","36pt","800pt","520pt"], contents: KernValues.join ('\r')});
	replace ("(?-m)([^\\r]+\\r)\\1+", "$1");
	replace ("^ ", "SPACE");
	replace ("(?<=\\t) ", "SPACE");
	}


function replace (f,r)
	{
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.findWhat = f;
	app.changeGrepPreferences.changeTo = r;
	app.activeDocument.changeGrep();
	}

function OpenCopy ()
	{
	// Get a unique file name by appending and incrementing
	// a number to the file name
		function uniqueName (base)
			{
			base = base.replace(/\.indd$/,"");
			var n=0;
			while(File(base+".indd").exists)
				base = base.replace(/_\d+$/,"") + "_"+String(++n);
			return base+".indd";
			} // uniqueName 

	var f = uniqueName(String(app.activeDocument.fullName).replace(/\.indd$/,"___kcopy.indd"));
	if (app.version[0] >= 7)
		app.activeDocument.saveACopy(File(f));
	else
		app.activeDocument.save(File(f));
	app.open(File(f));
	} // OpenCopy


function PrepareDocument ()
	{
	app.findChangeGrepOptions.includeFootnotes=true;
	app.findChangeGrepOptions.includeMasterPages=true;
	app.findChangeGrepOptions.includeHiddenLayers=true;
	app.findChangeGrepOptions.includeLockedLayersForFind=true;
	app.findChangeGrepOptions.includeLockedStoriesForFind=true;

	// We're deleting characters that have Metrics as kerning method,
	// but that includes the footnotes as well. So we add Optical 
	// to the character presecing footnotes.
	
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.findWhat = "(.)(?=~F)";
	app.changeGrepPreferences.changeTo = "$1";
	app.findGrepPreferences.kerningMethod = "$ID/Metrics";
	app.changeGrepPreferences.kerningMethod = "$ID/Optical";
	app.activeDocument.changeGrep();

	// Remove all characters that use metrics as kerning method.
	
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.findWhat = "(?s)(?<=.).*";
	app.findGrepPreferences.kerningMethod = "$ID/Metrics";
	app.activeDocument.changeGrep();
	}


function initSpecials()
	{
	var o = {};
	o["1396929140"]="COPYRIGHT_SYMBOL";
	o["1396984945"]="DOUBLE_LEFT_QUOTE";
	o["1396986481"]="DOUBLE_RIGHT_QUOTE";
	o["1396986737"]="DOUBLE_STRAIGHT_QUOTE";
	o["1396991858"]="DEGREE_SYMBOL";
	o["1397058884"]="EM_DASH";
	o["1397058899"]="EM_SPACE";
	o["1397059140"]="EN_DASH";
	o["1397059155"]="EN_SPACE";
	o["1397122899"]="FIGURE_SPACE";
	o["1397252717"]="HEBREW_MAQAF";
	o["1397252723"]="HEBREW_SOF_PASUK";
	o["1397253989"]="HEBREW_GERESH";
	o["1397254003"]="HEBREW_GERSHAYIM";
	o["1397256787"]="HAIR_SPACE";
	o["1397518451"]="ELLIPSIS_CHARACTER";
	o["1397645907"]="NONBREAKING_SPACE";
	o["1397645928"]="NONBREAKING_HYPHEN";
	o["1397776754"]="PARAGRAPH_SYMBOL";
	o["1397780051"]="PUNCTUATION_SPACE";
	o["1397847379"]="QUARTER_SPACE";
	o["1397904493"]="REGISTERED_TRADEMARK";
	o["1397967985"]="SINGLE_LEFT_QUOTE";
	o["1397969521"]="SINGLE_RIGHT_QUOTE";
	o["1397969777"]="SINGLE_STRAIGHT_QUOTE";
	o["1397975379"]="SIXTH_SPACE";
	o["1398040659"]="THIRD_SPACE";
	o["1398041963"]="TRADEMARK_SYMBOL"
	o["1398042195"]="THIN_SPACE";
	o["1399092323"]="DOTTED_CIRCLE";
	o["1399746146"]="FIXED_WIDTH_NONBREAKING_SPACE";
	o["1400073811"]="SECTION_SYMBOL";
	return o;
	}
