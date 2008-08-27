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
Goar.CalendarView = SC.View.extend(
/** @scope Goar.CalendarView.prototype */ {

  emptyView: '<div class="calendar-day"></div>',
	
	content: function(key, value) {
    
    // set the value of the label text.  Possibly localize and set innerHTML.
    if (value !== undefined) {
      if (this._content != value) {
        var date = this._content = _setDateOnDay(value) ;
        var day = date.getDate();
        el.innerHTML = day ;
				
				//check if today
				this.setClassName('calendar-today', _setDateOnDay(new Date()) == date );
      }
    }

    if (!this._content) {
      this._content = new Date();
    }
    return this._content ;
  }.property(),
	
	//private
	init: function(){
		var day = content.getDate();
		el.innerHTML = day;
	},
	
	_setDateOnDay: function(date){
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	},
	
	
}) ;
