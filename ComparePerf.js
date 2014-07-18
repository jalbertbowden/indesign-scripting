




/*
     FILE ARCHIVED ON 1:10:08 Oct 19, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:19:11 Jul 3, 2014.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/***********************************************************************/
/*                                                                     */
/*      ComparePerf ::    ExtendScript Performance Comparator          */
/*                                                                     */
/*      [Ver: 1.0]   [Author: Marc Autret]          [Modif: 06/23/11]  */
/*      [Lang: EN]   [Req: InDesign CS3/CS4/CS5]    [Creat: 06/23/11]  */
/*                                                                     */
/*      Installation:                                                  */
/*                                                                     */
/*      1) Place the current file into Scripts/Scripts Panel/          */
/*                                                                     */
/*      2) Run InDesign                                                */
/*                                                                     */
/*      3) Exec the script from your scripts panel:                    */
/*           Window > Automation > Scripts   [CS3/CS4]                 */
/*           Window > Utilities > Scripts    [CS5]                     */
/*         + double-click on the script file name                      */
/*                                                                     */
/*      Bugs & Feedback : marc{at}indiscripts{dot}com                  */
/*                        www.indiscripts.com                          */
/*                                                                     */
/***********************************************************************/

function perf(/*int*/n, /*func*/f /*,arg1,arg2,...*/)
//--------------------------------------
{
	var args =  Array.prototype.slice.call(arguments, 2);

	var i = (n=n||1), t, r = 0;
		
	while(i--)
		{
		$.hiresTimer;
		f.apply(null, args);
		t = $.hiresTimer;
		r += t;
		}

	// Clean up
	// ---
	args.length = 0;
	args = null;
	
	// Average time
	// ---
	return ~~(r/n);
};

function comparePerf(/*func*/f1, /*func*/f2 /*,arg1,arg2,...*/)
//--------------------------------------
{
	var args =  Array.prototype.slice.call(arguments, 2),
		n = comparePerf.PASSES;
	
	var t1 = perf.apply(null, [n, f1].concat(args)),
		t2 = perf.apply(null, [n, f2].concat(args)),
		r = .1 * ~~(10*(t1/t2));
	
	// Clean up
	// ---
	args.length = 0;
	args = null;
	
	alert('============================\r\r' +
		f1.name + '   vs.    ' + f2.name + '\r\r' +
		'============================\r\r\r' +
		'Average time after ' + n + ' passes:\r\r' +
		'   ' + f1.name + ':  ' + t1 + ' \xB5s\r' +
		'   ' + f2.name + ':  ' + t2 + ' \xB5s\r\r' +
		'RATIO:  ' + r );

}

comparePerf.PASSES = 10;



//////////////////////////////////
//
//        SAMPLE CODE
//
//////////////////////////////////


function arrayPush()
{
	var a = [], n = 1000;
	while( n-- ) a.push(1);
};

function arrayKey()
{
	var a = [], n = 1000;
	
	var i = -1;
	while( n-- ) a[++i] = 1;
};

comparePerf(arrayPush, arrayKey);