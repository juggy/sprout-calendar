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


SCal.CalendarWeekView = SC.View.extend(
/** @scope SCal.CalendarWeekView.prototype */ {

  emptyView: '<div class="calendar-week"></div>',

	/*
	Height and width of one day
	*/
	daySize: 20,
	
	/*
	Default view used for the day, much like exampleView in the ListView
	*/
	dayView: SCal.CalendarDayView,
	
	needsReframe: true,
	
	content: function(key, value) {
    
    // set the value of the label text.  Possibly localize and set innerHTML.
    if (value !== undefined) {
      if (this._content != value) {
        var date = this._content = value ;
				_updateDays();
      }
    }
    if (!this._content) {
      this._content = _setDateOnWeekStart(new Date());
    }
    return this._content ;
  }.property(),
	
	weekStart : function(){
		var date = _setDateOnWeekStart(this.get('content'));
		return date;
	}.property('content'),
	
	//private
	init : function(){
		this._dayViewPool= [];
	},
	_setDateOnWeekStart: function(date){
		date.setTime(date.getTime() - (date.getDay() * ONE_DAY));
		return date;
	},
	_updateDays : function() {
		if( this._dayViewPool.length == 0 ){
			var view;
			for(i = 0; i <= 6; i++){
				view = this.get('dayView').create({owner: this, displayDelegate: this }) ;
				view.set('weekDay', i);
				view.bind('content', 'weekStart');
				this.dayViewPool.push(view);
			}
		}
		if(this.get('needsReframe')){
			size = this.get('daySize');
			var f;
			for(i = 0; i < this._dayViewPool.length; i++){
				//reframe the days
				var day = this.dayViewPool[i];
				f = { x: size * i, y: 0, width: size, height: size };
				day.set('frame', f);
			}
			//set week width/height
			var parent = this.get('parentNode') ;
      if (parent) parent.viewFrameWillChange() ;

			f = this.get('frame');
			f.width = size * this.dayViewPool.length;
			f.height = size;
			this.set('frame', f);
			
			if (parent) parent.viewFrameDidChange() ;
			
			this.set('needsReframe', false);
		}
	}
	
}) ;
