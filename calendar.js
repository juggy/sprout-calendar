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
SCal.CalendarView = SC.View.extend(SC.Control,
/** @scope Goar.CalendarView.prototype */ {

	//Calendar property
	selection: [], //TODOD
	selectionDateRange: [null, null], //TODO
	canNavigate: true, 
	rows: 1,
	columns: 1,
	daySize: 26,
	headSize: 36,

  emptyElement: '<div class="calendar"></div>',
	
	//private
	
	init : function(){
		sc_super();
		this._monthViewPool = [];
		this._prevButton = null;
		this._nextButton = null;
	},
	
	_render : function(){
		rows = this.get('rows');
		columns = this.get('columns');
		isHorizontal = rows >= columns ? true : false;
		
		var runningDate = new Date(this.get('content'));
		
		//render the months
		var i = 0;
		for(var i = (rows * columns) - 1; i >= 0 ; i-- ){
			view =  (this._monthViewPool.length > i) 
								? this._monthViewPool[i]
								: this.invokeDelegateMethod(this.displayDelegate, "createMonthViewDelegate");
			this.appendChild(view);
		
			view.set('headSize', this.get('headSize'));
			view.set('daySize', this.get('daySize'));
			view.set('content', new Date(runningDate));
			view._updateWeeks();
			
			//queue that view into the pool
			if( this._monthViewPool.length >= i){
				this._monthViewPool.push(view);
			}
			
			//update the running date for the next month
			if(runningDate.getMonth() == 11){
				//year change
				runningDate.setYear(runningDate.getYear() + 1);
				runningDate.setMonth(0);
			}else{
				runningDate.setMonth(runningDate.getMonth() + 1);
			}
		}
		
		//remove unused months. (if rows or columns changed)
		while((rows * columns) < this._monthViewPool.length){
			view = this._monthViewPool.pop();
			this.removeChild(view);
		}
		
		//create the previous and next button if needed
		if(this.get('canNavigate')){
			if(!this._prevButton){
				this._prevButton = SC.ButtonView.create({target: this, action: "previousCalendar"});
				this._prevButton.set('innerHTML', '<img src="' + static_url('image/previous.png') + '"/>');
				this._prevButton.setClassName('prev-button', true);
				this.appendChild(this._prevButton);
			}
			if(!this._nextButton){
				this._nextButton = SC.ButtonView.create({target: this, action: "previousCalendar"});
				this._nextButton.set('innerHTML', '<img src="' + static_url('image/next.png') + '"/>');
				this._nextButton.setClassName('next-button', true);
				this.appendChild(this._nextButton);
			}
		}
		
		//reframe all this
		this._reframe();
		
	}.observes('content', 'rows', 'columns', 'canNavigate', 'selectionDateRange'),
	
	_reframe: function(){		
		rows = this.get('rows');
		columns = this.get('columns');
		
		var f = null;
		delta_y = 0;
		for(var y = 0; y < rows; y++){
			delta_x = 0;
			for(var x = 0; x < columns; x++){
				var month = this._monthViewPool[x * y];
				
				f = month.get('frame');			
				f.x = delta_x;
				f.y = delta_y;
				delta_x += f.width;
				
				month.viewFrameWillChange() ;
				month.set('frame', f);
				month.viewFrameDidChange() ;
			}
			delta_y += (f.height - 1);
		}
		
		f = this.get('frame');
		
		if(this.get('canNavigate')){
			this._prevButton.set('frame', {x:0, y:0, width: 20, height: 20});
			this._nextButton.set('frame', {x:0, y:(f.width - 20), width: 20, height: 20});
		}
		
	},
	
	previousCalendar: function(){
		var date = new Date(this.get('content'));
		nbMonths = this.get('rows') * this.get('columns');
		
		diffMonth = date.getMonth() - nbMonths;
		if(diffMonth < 0){
			//change year
			date.setYear(date.getYear() - (1 + nbMonths/12) );
			date.setMonth(date.getMonth() + diffMonth); 
		}else{
			date.setMonth(diffMonth);
		}
		this.set('content', date);
	},
	
	nextCalendar: function(){
		var date = new Date(this.get('content'));
		nbMonths = this.get('rows') * this.get('columns');
		
		diffMonth = date.getMonth() + nbMonths;
		if(diffMonth > 11){
			//change year
			date.setYear(date.getYear() + (1 + nbMonths/12) );
			date.setMonth(diffMonth - 11); 
		}else{
			date.setMonth(diffMonth);
		}
		this.set('content', date);
	},
	
	createMonthViewDelegate: function(){
		return SCal.CalendarMonthView.create({owner: this, displayDelegate: this.displayDelegate});
	}
}) ;
