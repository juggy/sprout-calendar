// ==========================================================================
// SCal.CalendarDayView
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.View
  @author AuthorName
  @version 0.1
*/

ONE_DAY = 1000*60*60*24; //in millisecond

SCal.CalendarDayView = SC.View.extend(
/** @scope SCal.CalendarDayView.prototype */ {

  emptyView: '<div class="calendar-day"></div>',

	/*
	Week day (0,1,2,3,4,5,6)
	*/
	weekDay: 0;
	
	/*
	Enable or disable the day w/r to the clicks/select
	*/
	isEnabled: function(key, value){
		
	},
	
	content: function(key, value) {
    
    // set the value of the label text.  Possibly localize and set innerHTML.
    if (value !== undefined) {
      if (this._content != value) {
        var date = this._content = _setDateOnDay(value) ;
				date = date.setTime(date.getTime() + (this.get('weekDay') * ONE_DAY));
        el.innerHTML = date.setTime().getDate();
				
				//check if today
				this.setClassName('today', _setDateOnDay(new Date()) == date );
      }
    }

    if (!this._content) {
      this._content = _setDateOnDay(new Date());
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
	}
}) ;
