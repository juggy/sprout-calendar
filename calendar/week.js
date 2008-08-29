// ==========================================================================
// SCal.CalendarWeekView
// ==========================================================================

require('core');
require('day');

/** @class

  (Document Your View Here)

  @extends SC.View
  @author AuthorName
  @version 0.1
*/

SCal.ONE_WEEK_DAYS = 7;
SCal.ONE_WEEK = SCal.ONE_DAY * SCal.ONE_WEEK_DAYS;

SCal.CalendarWeekView = SC.View.extend(
/** @scope SCal.CalendarWeekView.prototype */ {

  emptyElement: '<div class="calendar-week"></div>',

	/*
	Height and width of one day
	*/
	daySize: 20,
	
	/*
	Default view used for the day, much like exampleView in the ListView
	*/
	dayView: SCal.CalendarDayView,
	
	monthWeek: -1,
	
	content: function(key, value) {
    
    // set the value of the label text.  Possibly localize and set innerHTML.
    if (value !== undefined) {
      if (this._content != value) {
				
				this.set('currentMonth', value.getMonth());
				this._content = this._setDateOnWeekStart(value) ;
				
				this.setClassName('top-week', (this.get('monthWeek') == 0));
				this.setClassName('standalone', (this.get('monthWeek') == -1));
				this._needsReframe = true;
				this._updateDays();
      }
    }
    if (!this._content) {
      this._content = this._setDateOnWeekStart(new Date());
    }
    return this._content ;
  }.property(),
	
	/*
	The current month showing
	*/
	currentMonth: 0,
	
	weekStart : function(){
		return this._setDateOnWeekStart(new Date(this.get('content')))
		
	}.property('content'),
	
	//private
	init : function(){
		this._dayViewPool= [];
	},
	
	_setDateOnWeekStart: function(date){
		date.setTime(date.getTime() - (date.getDay() * SCal.ONE_DAY));
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
			for(i = 0; i < this._dayViewPool.length; i++){
				//reframe the days
				var day = this._dayViewPool[i];
				f = { x: size * i, y: 0, width: size, height: size };
				day.viewFrameWillChange() ;
				day.set('frame', f);
				day.viewFrameDidChange() ;
			}
			//set week width/height
	    this.viewFrameWillChange() ;

			f = this.get('frame');
			f.width = size * this._dayViewPool.length;
			f.height = size;
			this.set('frame', f);
		
			this.viewFrameDidChange() ;
		
			this._needsReframe, false;
		}
	}.observes('daySize'),
	
	_updateDays : function() {
		var view;
		var weekStart = this.get('weekStart');
		var dayView = this.get('dayView') ? this.get('dayView') : SCal.CalendarDayView;
		for(var i = 0; i < SCal.ONE_WEEK_DAYS; i++){
			view =  (this._dayViewPool.length > i) 
								? this._dayViewPool[i]
								: dayView.create({owner: this, displayDelegate: this });
			this.appendChild(view);
			
			view.set('currentMonth', this.get('currentMonth'));
			view.set('content', new Date(weekStart.getTime() + (i * SCal.ONE_DAY)));

			if (this._dayViewPool.length == i) this._dayViewPool.push(view);
		}
		
		this.reframe();
	}
	
}) ;
