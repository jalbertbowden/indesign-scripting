




/*
     FILE ARCHIVED ON 18:30:25 Oct 3, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:17:45 Jul 3, 2014.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/***********************************************************************/
/*                                                                     */
/*      RegexTester ::  Test your Regular Expressions in ExtendScript  */
/*                                                                     */
/*      [Ver: 1.01]   [Author: Marc Autret]       [Modif: 12/17/11]    */
/*      [Lang: EN]    [Req: InDesign CS4/CS5+]    [Creat: 11/04/11]    */
/*                                                                     */
/*      Installation:                                                  */
/*                                                                     */
/*      1) Place the current file into Scripts/Scripts Panel/          */
/*                                                                     */
/*      2) Run InDesign                                                */
/*                                                                     */
/*      3) Exec the script from your scripts panel:                    */
/*           Window > Automation > Scripts   [CS4]                     */
/*           Window > Utilities > Scripts    [CS5/CS5.5]               */
/*         + double-click on the script file name                      */
/*                                                                     */
/*      Bugs & Feedback : marc{at}indiscripts{dot}com                  */
/*                        www.indiscripts.com                          */
/*                                                                     */
/***********************************************************************/

var	scriptName = "RegexTester",
	scriptVersion = "1.01";

var	S_DF_REGEX = /^((\d+)-)?((\d+)-)?(\d+)$/.toString(),
	d = new Date(),
	S_DF_TEST = d.getFullYear()+'-'+(1+d.getMonth())+'-'+d.getDate(),
	S_VERSION = "ExtendScript: " + $.version +
		( (app && ('version' in app))?
		(" \u2014 InDesign: " + app.version):"" ),
	S_FONT = -1 != $.os.toLowerCase().indexOf('windows') ? 'Consolas' : 'AndaleMono',
	N_RESULT_LINES = 14;


var escapeString = function(/*str*/s)
// =====================================
{
	if( null===s || 'undefined'==typeof s )
		{
		return ''+s;
		}

	var r = s.toSource(),
		p0 = r.indexOf('"'),
		p1 = r.lastIndexOf('"');

	return r.substring(p0,1+p1);
};


var dlg = function()
// =====================================
{
	var	u,
		dlgTitle = ' ' + scriptName + ' ' + scriptVersion + "  |  \u00A9Indiscripts.com",
		w = new Window('dialog', dlgTitle),
		// ---
		pRegex = w.add('panel',u,"Regex"),
		gRegex = pRegex.add('group'),
		eRegex = gRegex.add('edittext',u,S_DF_REGEX,{borderless:true}),
		// ---
		pTest = w.add('panel',u,"Test-String"),
		gTest = pTest.add('group'),
		eTest = gTest.add('edittext',u,S_DF_TEST,{borderless:true}),
		// ---
		pResult = w.add('panel',u,"Results"),
		sVersion = pResult.add('statictext',u, S_VERSION),
		eResult = pResult.add('edittext',u,
			Array.prototype.join.call({length:N_RESULT_LINES},'\r'),
			{ multiline:true, scrolling:true, readonly:true }),
		//---
		gButtons = w.add('group'),
		bTest = gButtons.add('button', u, "RE.test(STR)"),
		bMatch = gButtons.add('button', u, "STR.match(RE)"),
		bClear = gButtons.add('button', u, "Clear"),
		bCancel = gButtons.add('button', u, "Cancel");
	
	w.graphics.backgroundColor = w.graphics.newBrush(0, [.95,.95,.95,1]);
	gRegex.graphics.backgroundColor = w.graphics.newBrush(0, [.6,.8,.8,1]);
	gTest.graphics.backgroundColor = w.graphics.newBrush(0, [.6,.8,.8,1]);
	
	pRegex.margins = pTest.margins = [15,18,15,15];
	gRegex.margins = gTest.margins = 2;
	
	pRegex.alignment = gRegex.alignment = ['fill','top'];
	pTest.alignment = gTest.alignment = ['fill','top'];
	pResult.alignment = ['fill','top'];
	eRegex.alignment = eTest.alignment = eResult.alignment = ['fill','fill'];
	
	try	{
		eRegex.graphics.font = ScriptUI.newFont(S_FONT, 'regular', 17);
		eTest.graphics.font = ScriptUI.newFont(S_FONT, 'regular', 17);
		eResult.graphics.font = ScriptUI.newFont(S_FONT, 'bold', 12);
		}
	catch(_){/*keep the default font*/}

	var report = function(/*any[]*/a)
	{
		var s = a.join("\r") +
				"\r__________________________________\r\r";
		eResult.text = s + eResult.text;
	};

	var preCheck = function()
	{
		var s = eRegex.text,
			re;
		
		if( !s )
			{
			report(["[ERR]\tEmpty 'Regex' field!"]);
			return false;
			}

		try	{
			eval("re="+s+";");
			}
		catch(e)
			{
			report(["[ERR]\t" + e.toString()]);
			return false;
			}

		if( !(re instanceof RegExp) )
			{
			report( ["[ERR]\tInvalid RegExp!", " => " + (re && re.toSource())] );
			return false;
			}
		
		return re;
	};

	bClear.onClick = function()
	{
		eResult.text = "";
	};

	bTest.onClick = function()
	{
		var re = preCheck(),
			s = eTest.text,
			t, i,
			vars = [];
		if( !re ) return;
		t = re.test(s);
		
		for( i=9 ; 0 < i && !RegExp['$'+i]; i-- );
		if( i < 8 )
			vars = ['$'+(1+i)+'-$9:\t ""'];
		else
			++i;
		for( ; 0 < i ; vars.unshift("$"+i+":\t"+escapeString(RegExp['$'+i])), i-- );
		
		report([
			"Regex:\t" + re.toString(),
			"String:\t" + escapeString(s),
			"Test:\t" + t,
			"\u2014",
			//"lastIndex:\t" + RegExp.lastIndex,
			vars.join('\r'),
			"\u2014",
			"Left Context:\t" + escapeString(RegExp.leftContext),
			"Right Context:\t" + escapeString(RegExp.rightContext),
			"Last Match:\t" + escapeString(RegExp.lastMatch),
			"Last Paren.:\t" + escapeString(RegExp.lastParen),
			"Last Index:\t" + re.lastIndex
			]);
	};
	
	bMatch.onClick = function()
	{
		var re = preCheck(),
			s = eTest.text,
			m, i;
		if( !re ) return;
		m = s.match(re);
		
		report([
			"Regex:\t" + re.toString(),
			"String:\t" + escapeString(s),
			"Match:\t" + (m?(m.length+' match'+(1<m.length?'es':'')+(re.global?' [GLOBAL]':'')):(''+m)),
			"\u2014",
			"Left Context:\t" + escapeString(RegExp.leftContext),
			"Right Context:\t" + escapeString(RegExp.rightContext),
			"Last Match:\t" + escapeString(RegExp.lastMatch),
			"Last Paren.:\t" + escapeString(RegExp.lastParen),
			"Last Index:\t" + re.lastIndex
			].concat(m?["\u2014","Matches:\t"+m.toSource()]:[])
			);
	};

	w.onShow = function()
	{
		eResult.text = '';
	};

	w.show();
};

dlg();