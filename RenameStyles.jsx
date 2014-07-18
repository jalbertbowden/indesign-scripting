
/*
	
	In character-style names, replace spaces with underscores, remove diacritics,
	remove non-word characters, and lower-case what remains.
	Duplicate names are avoided by suffixing _1, _2, etc.
	
	Peter Kahrel at PepCon 2014
	Version: 1.0, June 23, 2014
	
*/

// Single undo of script added by Jim Birkenseer.
if (parseInt(app.version) >= 6)
{
	// ID CS4 or newer. This script creates a single undo in the Edit menu.
	app.doScript(main, ScriptLanguage.javascript, undefined, UndoModes.entireScript, "Undo Rename Styles");
}
else
{
	// ID CS3 or older. This version of InDesign cannot create a single undo for a script.
	main();
}

function main ()
{
	// Check for open documents and prompt to start code added by Jim Birkenseer.
	if (app.documents.length == 0)
	{
		alert("Rename styles requires that an InDesign document is open.");
		return;
	}
	
	var retVal = confirm("Remove special characters from all style names in your InDesign document?");
	if (!retVal)
	{
		alert("The script has been canceled. Your document has not been modified.");
		return;
	}


	// Pre-compile all regexes
	var reNonWordChar = /\W/g;
	var reSpace = / /g;
	var reA =/[áàâäåāąăæ]/g;
	var reC =/[çćčċ]/g;
	var reD =/[ďđ]/g;
	var reE =/[éèêëęēĕėě]/g;
	var reG =/[ģĝğġ]/g;
	var reH =/[ĥħ]/g;
	var reI =/[íìîïīĩĭįi̇]/g;
	var reJ =/[ĵ]/g;
	var reK =/[ķ]/g;
	var reL =/[łĺļľ]/g;
	var reN =/[ñńňņŋ]/g;
	var reO =/[óòôöōŏőøœ]/g;
	var reR =/[ŕřŗ]/g;
	var reS =/[śšŝşș]/g;
	var reSS =/ß/g;
	var reT =/[ţțťŧ]/g;
	var reU =/[úùûüůūųũŭűų]/g;
	var reW =/[ŵ]/g;
	var reY =/[ÿýŷ]/g;
	var reZ =/[źżž]/g;
	
	// The following regex tests if a style name is already ok. If we don't do this,
	// ok style names get a unique-making suffix even if they are already unique.
	
	var isOK = /^[_a-z0-9]+$/;
	
	var name = "";
	
	renameStyles ('allCharacterStyles');
	renameStyles ('allParagraphStyles');
	renameStyles ('allObjectStyles');
	renameStyles ('allTableStyles');
	renameStyles ('allCellStyles');


	function renameStyles (category)
	{
		var styles = app.documents[0][category];
		var known = getNames (styles);
	
		for (var i = styles.length-1; i > 0; i--)
		{
			if (styles[i].name.indexOf ('[') < 0)
			{
				styles[i].name = renamed (styles[i].name, known);
			}
		}
	} // renameStyles


	function getNames (styles)
	// Collect the stylenames of only those style names 
	// that do not conform to the required format
	{
		var obj = [];
		for (var i = styles.length-1; i > 0; i--)
		{
			if (!isOK.test(styles[i].name))
			{
				obj[styles[i].name] = true;
			}
		}
		return obj;
	}


	function renamed (str, known)
	{
		str = stripAccents (str.toLowerCase());
		str = str.replace (reSpace, "_").replace (reNonWordChar, "");
		return uniqueName (str, known);
	}


	function uniqueName (base, known)
	{
		function stripBase (s) {return s.replace(/_\d+$/,"");}
		
		var n = 0;
		while (known[base])
		{
			base = stripBase (base) + "_" + String(++n);
		}
		known[base] = true;
		return base;
	}


	function stripAccents (s)
	{
		return s.replace (reA, "a").
			replace (reC, "c").
			replace (reD, "d").
			replace (reE, "e").
			replace (reG, "g").
			replace (reH, "h").
			replace (reI, "i").
			replace (reJ, "j").
			replace (reK, "k").
			replace (reL, "l").
			replace (reN, "n").
			replace (reO, "o").
			replace (reR, "r").
			replace (reS, "s").
			replace (reSS, "ss").
			replace (reT, "t").
			replace (reU, "u").
			replace (reW, "w").
			replace (reY, "y").
			replace (reZ, "z");
	} // stripAccents
	
	alert("Style renaming is complete."); // Added by Jim Birkenseer

} // main