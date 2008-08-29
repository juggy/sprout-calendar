// ==========================================================================
// SCal.CalendarMonthView
// ==========================================================================

require('core');
require('day');

/** @class

  (Document Your View Here)

  @extends SC.View
  @author AuthorName
  @version 0.1
*/

SCal.ONE_MONTH_WEEKS = 5;

SCal.CalendarMonthView = SC.View.extend(
/** @scope SCal.CalendarMonthView.prototype */ {

  emptyElement: '<div class="calendar-month"></div>',

	/*
	Height and width of one day
	*/
	daySize: 20,
	
	/*
	Default view used for the week, much like exampleView in the ListView
	*/
	weekView: SCal.CalendarWeekView,

	
	content: function(key, value) {
    
    // set the value of the label text.  Possibly localize and set innerHTML.
    if (value !== undefined) {
      if (this._content != value) {
        var date = this._content = value ;
				this._needsReframe = true;
				this._updateWeeks();
      }
    }
    if (!this._content) {
      this._content = this._setDateOnMonthStart(new Date());
    }
    return this._content ;
  }.property(),
	
	monthStart : function(){
		return this._setDateOnMonthStart(new Date(this.get('content')));
	}.property('content'),
	
	//private
	
	
	init : function(){
		this._weekViewPool = [];
		this._monthNameView = SC.LabelView.create();
		this._dayNameViews = [];
		
		//append month name view
		this._monthNameView.setClassName('calendar-month-name', true);
		this.appendChild(this._monthNameView);
		
		//create and append day name views
		var date = new Date();
		date.setTime(date.getTime() - (date.getDay() * SCal.ONE_DAY));
		
		for(var i = 0; i < SCal.ONE_WEEK_DAYS; i++){
			var view = SC.LabelView.create();
			view.set('value', date.format("E").charAt(0));
			view.setClassName('calendar-day-name', true);
			this._dayNameViews.push(view);
			this.appendChild(view);
			date.setTime(date.getTime() + SCal.ONE_DAY);
		}
			
	},
	
	_setDateOnMonthStart: function(date){
		date.setDate(1);
		return date;
	},
	/*
	Used to reframe when daySize changed
	*/
	_needsReframe: true,
	reframe: function(){
		if(this._needsReframe){
			size = this.get('daySize');
			var f;
			
			//frame the header views
			f = {x:0, y:0, width:size * SCal.ONE_WEEK_DAYS, height: size };
			this._monthNameView.set('frame', f);
			
			for(var i = 0; i < SCal.ONE_WEEK_DAYS; i++){
				f = {x:i * size, y: size, width: size, height: size};
				this._dayNameViews[i].set('frame', f);
			}
			
			
			for(i = 0; i < this._weekViewPool.length; i++){
				//reframe the days
				var week = this._weekViewPool[i];
				f = { x: 1, y: (2 * size) + size * i, width: size * SCal.ONE_WEEK_DAYS, height: size };
				week.viewFrameWillChange() ;
				week.set('frame', f);
				week.viewFrameDidChange() ;
				
			}
			//set week width/height
	    this.viewFrameWillChange() ;

			f = this.get('frame');
			f.width = size * SCal.ONE_WEEK_DAYS + 2;
			f.height = size * (this._weekViewPool.length + 2) + 2;
			this.set('frame', f);
		
			this.viewFrameDidChange() ;
		
			this._needsReframe, false;
		}
	}.observes('daySize'),
	
	_updateWeeks : function() {
		var monthStart = this.get('monthStart');
		var runningDate = new Date(monthStart);
		var checkDate = new Date(monthStart);
		
		var view;
		var weekView = this.get('weekView') ? this.get('weekView') : SCal.CalendarWeekView;
		
		//update month name
		this._monthNameView.set('value', monthStart.format("MMM"));
		
		var i = 0;
		while( true ){
			view =  (this._weekViewPool.length > i) 
								? this._weekViewPool[i]
								: weekView.create({owner: this, displayDelegate: this });
										
			//check if we should continue building views
			if(i == 0){
				view._setDateOnWeekStart(checkDate);	
			}else{
				runningDate.setTime(checkDate.getTime() + (SCal.ONE_DAY * SCal.ONE_WEEK_DAYS));
				checkDate.setTime(checkDate.getTime() + (SCal.ONE_DAY * SCal.ONE_WEEK_DAYS));
				if(checkDate.getMonth() != monthStart.getMonth()) break;
			}
			
			this.appendChild(view);
		
			view.set('monthWeek', i);
			view.set('daySize', this.get('daySize'));
			view.set('content', new Date(runningDate));
			

			if( this._weekViewPool.length == i) this._weekViewPool.push(view);
			
			i++;
		}
		
		//remove unused weeks. (number of weeks in a month varies from 4 to 6)
		while(i < this._weekViewPool.length){
			view = this._weekViewPool.pop();
			this.removeChild(view);
		} 
		
		this.reframe();
	}
	
}) ;
