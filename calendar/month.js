// ==========================================================================
// SCal.CalendarMonthView
// ==========================================================================

require('core');

/** @class

  (Document Your View Here)

  @extends SC.View
  @author AuthorName
  @version 0.1
*/

SCal.ONE_MONTH_WEEKS = 5;

SCal.CalendarMonthView = SC.View.extend( SC.Control, SC.DelegateSupport,
/** @scope SCal.CalendarMonthView.prototype */ {

  emptyElement: '<div class="calendar-month"></div>',

	/*
	Height and width of one day
	*/
	daySize: 26,
	
	/*
	Height of the header of the month
	*/
	headSize: 36,
	
	monthStart : function(){
		return this._setDateOnMonthStart(new Date(this.get('content')));
	}.property('content'),
	
	//private
	init : function(){
		sc_super();
		this._weekViewPool = [];
		
		this._monthNameView = SC.LabelView.create();
		this._dayNameViews = [];
		this._head = SC.View.create();
		
		this._head.setClassName('calendar-head', true);
		this.appendChild(this._head);
		
		//append month name view
		this._monthNameView.setClassName('calendar-month-name', true);
		this._head.appendChild(this._monthNameView);
		
		//create and append day name views
		var date = new Date();
		date.setTime(date.getTime() - (date.getDay() * SCal.ONE_DAY));
		
		for(var i = 0; i < SCal.ONE_WEEK_DAYS; i++){
			var view = SC.LabelView.create();
			view.set('value', date.format("E"));
			view.setClassName('calendar-day-name', true);
			this._dayNameViews.push(view);
			this._head.appendChild(view);
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
	reframe: function(){
		
		size = this.get('daySize');
		headSize = this.get('headSize');
		var f;
		
		//frame the header views
		f = {x:0, y:0, width:size * SCal.ONE_WEEK_DAYS, height: this.headSize };
		this._head.set('frame', f);
		
		f = {x:0, y:0, width:size * SCal.ONE_WEEK_DAYS, height: (headSize/2) };
		this._monthNameView.set('frame', f);
		
		for(var i = 0; i < SCal.ONE_WEEK_DAYS; i++){
			f = {x:i * size, y: (headSize/2), width: size, height: (headSize/2)};
			this._dayNameViews[i].set('frame', f);
		}
		
		
		for(i = 0; i < this._weekViewPool.length; i++){
			//reframe the days
			var week = this._weekViewPool[i];
			f = { x: 0, y: headSize + size * i, width: size * SCal.ONE_WEEK_DAYS, height: size };
			week.viewFrameWillChange() ;
			week.set('frame', f);
			week.viewFrameDidChange() ;
			week.set('daySize', size);
		}
		//set week width/height
    this.viewFrameWillChange() ;

		f = this.get('frame');
		f.width = size * SCal.ONE_WEEK_DAYS + 2;
		f.height = size * (this._weekViewPool.length) + headSize + 2;
		this.set('frame', f);
	
		this.viewFrameDidChange() ;
	
	}.observes('daySize', 'headSize'),
	
	_updateWeeks : function() {
		var monthStart = this.get('monthStart');
		var runningDate = new Date(monthStart);
		var checkDate = new Date(monthStart);
		
		var view;		
		//update month name
		this._monthNameView.set('value', monthStart.format("MMM yyyy"));
		
		var i = 0;
		while( true ){
			view =  (this._weekViewPool.length > i) 
								? this._weekViewPool[i]
								: this.invokeDelegateMethod(this.displayDelegate, "createWeekViewDelegate");
										
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
			
			if( this._weekViewPool.length == i){
				this._weekViewPool.push(view);
			}
			i++;
		}
		
		//remove unused weeks. (number of weeks in a month varies from 4 to 6)
		while(i < this._weekViewPool.length){
			view = this._weekViewPool.pop();
			this.removeChild(view);
		} 
		
		this.reframe();
	}.observes('content'),
	
	//Delegate support
	createWeekViewDelegate : function(){
		return SCal.CalendarWeekView.create({owner: this, displayDelegate: this.displayDelegate });
	}
}) ;
