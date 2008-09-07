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

SCal.CalendarDayView = SC.View.extend( SC.Control, SC.DelegateSupport,
/** @scope SCal.CalendarDayView.prototype */ {

  emptyElement: '<a class="calendar-day" href="javascript:;"></a>',
	
	/*
	The current month showing
	*/
	currentMonth: 1,
	
	//private
	init: function(){
		sc_super();
		if(content = this.get('content')){
			var day = content.getDate();
			this.set('innerHTML', day);
		}
	},
	
	_todayObserver: function(){
		var date = this._setDateOnDay(new Date(this.get('content')));
		this.setClassName('today', this._setDateOnDay(new Date()).getTime() == date.getTime() );
	}.observes('content'),
	
	_leftDayObserver: function(){
		this.setClassName('left-day', this.get('content').getDay() == 0);
	}.observes('content'),
	
	_otherMonthObserver: function(){
		this.setClassName('other-month', this.get('currentMonth') != this.get('content').getMonth());
	}.observes('content'),
	
	_setDateOnDay: function( date ){
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	},
	
	_render: function(){
		this.invokeDelegateMethod(this.displayDelegate, "willRenderDay");
    this.set('innerHTML', this.get('content').getDate());
		this.invokeDelegateMethod(this.displayDelegate, "didRenderDay");
	}.observes('content'),
	
	
	//Delegate support	
	/*
	Can be used to change the class names based on date
	*/
	willRenderDay : function(dayView, date){
		//do nothing
	},
	
	didRenderDay : function(dayView, date){
		//do nothing
	}
}) ;
