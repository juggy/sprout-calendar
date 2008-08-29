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

SCal.ONE_DAY = 86400000; //in millisecond

SCal.CalendarDayView = SC.View.extend( SC.Control,
/** @scope SCal.CalendarDayView.prototype */ {

  emptyElement: '<div class="calendar-day"></div>',

	/*
	Week day (0,1,2,3,4,5,6)
	*/
	weekDay: 0,
	
	/*
	The current month showing
	*/
	currentMonth: 1,
	
	/*
	Enable or disable the day w/r to the clicks/select
	*/
	isEnabled: function(key, value){
		
	},
	
	content: function(key, value) {
    
    // set the value of the label text.  Possibly localize and set innerHTML.
    if (value !== undefined) {
      if (this._content != value) {
        var date = this._content = this._setDateOnDay(value) ;
				date.setTime(date.getTime() + (this.get('weekDay') * SCal.ONE_DAY));
        this.set('innerHTML', date.getDate());
				
				//check if today
				this.setClassName('today', this._setDateOnDay(new Date()).getTime() == date.getTime() );
				
				//check if first day
				this.setClassName('left-day', this.get('weekDay') == 0);
				
				this.setClassName('other-month', this.get('currentMonth') != date.getMonth());
      }
    }

    if (!this._content) {
      this._content = this._setDateOnDay(new Date());
    }
    return this._content ;
  }.property(),
	
	//private
	init: function(){
		if(content = this.get('content')){
			var day = content.getDate();
			this.set('innerHTML', day);
		}
	},
	
	_setDateOnDay: function( date ){
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	}
}) ;
