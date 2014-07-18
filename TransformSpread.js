




/*
     FILE ARCHIVED ON 23:15:05 Oct 18, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 16:56:27 Jul 3, 2014.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/***********************************************************************/
/*                                                                     */
/*      TransformSpread ::  Scales, rotates, skews the active spread   */
/*                                                                     */
/*      [Ver: 1.1]    [Author: Marc Autret]       [Modif: 08/01/11]    */
/*      [Lang: EN]    [Req: InDesign CS4/CS5]     [Creat: 08/01/11]    */
/*                                                                     */
/*      Installation:                                                  */
/*                                                                     */
/*      1) Place the current file into Scripts/Scripts Panel/          */
/*                                                                     */
/*      2) Run InDesign, open a document                               */
/*                                                                     */
/*      3) Exec the script from your scripts panel:                    */
/*           Window > Automation > Scripts   [CS4]                     */
/*           Window > Utilities > Scripts    [CS5]                     */
/*         + double-click on the script file name                      */
/*                                                                     */
/*      Bugs & Feedback : marc{at}indiscripts{dot}com                  */
/*                        www.indiscripts.com                          */
/*                                                                     */
/***********************************************************************/

var	scriptName = "TransformSpread",
	scriptVersion = "1.0";

var CS_PASTEBOARD = CoordinateSpaces.PASTEBOARD_COORDINATES,
	AP_CENTER = AnchorPoint.CENTER_ANCHOR,
	MAX_SCALE = 100;
	X_ZERO_SCALE = Y_ZERO_SCALE = .0001,
	DF_ALL_SPREADS = false;

function dlg(/*TransformationMatrix*/mx, /*bool*/allSpreads)
// -----------------------------------------------
{
	var dlgTitle = ' ' + scriptName + ' ' + scriptVersion + "  |  \u00A9Indiscripts.com",
		d = app.dialogs.add({name:dlgTitle, canCancel:true}),
		
		pn = d.dialogColumns.add().borderPanels.add(),
		dc = pn.dialogColumns.add(),
		dr = dc.dialogRows.add(),
		
		// X-Scale
		// ---
		sXScale = dr.dialogColumns.add().
			staticTexts.add({
			staticLabel: "X-Scale:",
			minWidth: 100,
			}),
		eXScale = dr.dialogColumns.add().
			realEditboxes.add({
			editValue: mx.horizontalScaleFactor,
			minimumValue: -MAX_SCALE,
			maximumValue: MAX_SCALE,
			smallNudge: 1,
			largeNudge: 5,
			}),
		
		// Y-Scale
		// ---
		sYScale = (dr=dc.dialogRows.add()).dialogColumns.add().
			staticTexts.add({
			staticLabel: "Y-Scale:",
			minWidth: 100,
			}),
		eYScale = dr.dialogColumns.add().
			realEditboxes.add({
			editValue: mx.verticalScaleFactor,
			minimumValue: -MAX_SCALE,
			maximumValue: MAX_SCALE,
			smallNudge: 1,
			largeNudge: 5,
			}),

		// Rotation angle
		// ---
		sRotationAngle = (dr=dc.dialogRows.add()).dialogColumns.add().
			staticTexts.add({
			staticLabel: "Rotation Angle:",
			minWidth: 100,
			}),
		eRotationAngle = dr.dialogColumns.add().
			angleEditboxes.add({
			editValue: mx.counterclockwiseRotationAngle,
			minimumValue: -180,
			maximumValue: 180,
			smallNudge: 1,
			largeNudge: 10,
			}),

		// Shear-X Angle
		// ---
		sShearAngle = (dr=dc.dialogRows.add()).dialogColumns.add().
			staticTexts.add({
			staticLabel: "Shear-X Angle:",
			minWidth: 100,
			}),
		eShearAngle = dr.dialogColumns.add().
			angleEditboxes.add({
			editValue: mx.clockwiseShearAngle,
			minimumValue: -180,
			maximumValue: 180,
			smallNudge: 1,
			largeNudge: 10,
			}),

		// Reset CB
		cbReset = (dc=pn.dialogColumns.add()).dialogRows.add().dialogColumns.add().
			checkboxControls.add({
			staticLabel: "Reset",
			checkedState: false,
			}),

		// All Spreads CB
		cbAllSpreads = (dr=dc.dialogRows.add()).dialogColumns.add().
			checkboxControls.add({
			staticLabel: "All Spreads",
			checkedState: !!allSpreads,
			});
			
	var t,
		r = d.show()&&
			{
			reset: (t=cbReset.checkedState),
			allSpreads: cbAllSpreads.checkedState,
			horizontalScaleFactor: (t?1:eXScale.editValue),
			verticalScaleFactor: (t?1:eYScale.editValue),
			counterclockwiseRotationAngle: (t?0:eRotationAngle.editValue),
			clockwiseShearAngle: (t?0:eShearAngle.editValue),
			};

	d.destroy();
	
	d = pn = dc = dr = null;
	return r;
};

var transformSpreadMain = function()
//------------------------------------------------
{
	var tgSpread, mx, dlgRet;
	
	if( !app.documents.length )
		throw Error("Please open a document before running " + scriptName + ".");

	if( !(tgSpread=app.layoutWindows.length&&app.activeWindow.activeSpread) )
		throw Error("Unable to access the active spread.");

	if( !(dlgRet=dlg(tgSpread.transformValuesOf(CS_PASTEBOARD)[0], DF_ALL_SPREADS)) )
		return false;
	
	mx = app.transformationMatrices.add(
		dlgRet.horizontalScaleFactor||X_ZERO_SCALE, dlgRet.verticalScaleFactor||Y_ZERO_SCALE,
		dlgRet.clockwiseShearAngle, dlgRet.counterclockwiseRotationAngle,
		0,0);

	(dlgRet.allSpreads?app.activeDocument.spreads.everyItem():tgSpread).
		transform(CS_PASTEBOARD, AP_CENTER, mx, [MatrixContent.ROTATION_VALUE,MatrixContent.SCALE_VALUES, MatrixContent.SHEAR_VALUE]);
};

app.scriptPreferences.enableRedraw = false;
try{ transformSpreadMain(); }catch(_){ alert(_); }
app.scriptPreferences.enableRedraw = true;