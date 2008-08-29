// ==========================================================================
// Goar.CalendarView
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.View
  @author AuthorName
  @version 0.1
*/
SCal.CalendarView = SC.View.extend(
/** @scope Goar.CalendarView.prototype */ {

	//Calendar property
	content: new Date(),
	canSelectDateInThePast: true,
	canSelectDateInTheFuture: true,
	canNavigate: true,
	rows: 1,
	column: 1,

  emptyView: '<div></div>',
	
	

}) ;
