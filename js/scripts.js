$(document).ready( function(){

	var
		linearScale = d3.scaleLinear().domain([0,2000]).range([0,1000]),
		
		frontWheelX = linearScale(250), // close to 266, which is roughly a 20 inch wheel's radius in millimeters.
		wheelData = [linearScale(432), linearScale(432)],
		wheelbase = [0, 1324],
		tireHeights = [linearScale(120*.70), linearScale(190*.55)]
		colors = ['hsla(337, 0%, 50%, 0.75)', 'hsla(337, 0%, 50%, 0.75)'],
		positions = ['front', 'rear'],
		height = $('#play-place').attr('height');

	function scaled(dataSet) {
		var scaledData = []; 
		for (var i = 0; i < dataSet.length; i++) {
			scaledData[i] = linearScale(dataSet[i])
		}
		return scaledData
	}

	function update() {
		d3.select('svg').selectAll('circle')
			.classed('rear', true)
			.data(scaled(wheelbase))
			.transition()
			.attr('cx', function(d){if(d>0){return d-(wheelData[0]/2)}else{return frontWheelX}})
	}

	function create() {
		d3.select('svg').selectAll('circle')
			.data(wheelData)
			.enter()
			.append('circle')
			.attr('cx', function(d){return d/2})
			.attr('cy', height/2)
			.attr('r', function(d){return d/2})

		d3.select('svg').selectAll('circle')	
			.data(tireHeights)
			.attr('stroke', 'hsla(337, 0%, 50%, 0.75)')
			.attr('stroke-width', function(d){return d})

		d3.select('svg').selectAll('circle')
			.data(colors)
			.attr('fill', function(d){return d})

		d3.select('svg').selectAll('circle')
			.data(positions)
			.attr('class', function(d){return d})

		d3.select('svg').selectAll('circle')
			.data(scaled(wheelbase))
			.attr('cx', function(d){if(d>0){return d-(scaled(wheelData)[0]/2)}else{return frontWheelX}})
	}

	create()
	$('a').on('click', function(e) {
		e.preventDefault()
		wheelbase = [0, $(this).data('wheelbase')]
		update()

	})

	class Wheel {
		constructor(diameter, tire, position) {
			this.size = {inches: diameter, mm: diameter*25.4}
			this.tire = tire
			this.position = position
		}
		get fullHeight() {
			return this.size.mm + (this.tire.profile * this.tire.aspect)
		}

	}

	class Bike {
		constructor(make, model, year, wheels, specs) {
			this.make = make
			this.model = model
			this.year = year
			this.wheels = wheels
			this.specs = specs
		}

		get fullName() {
			return `${this.make} ${this.model}, ${this.year}` 
		}
	}



// fzr = new Bike('Yamaha', 'fzr400', 1990),
// console.log(fzr.fullName)
	var
		wheels = {
			front: new Wheel(17, {profile: 120, aspect: .70}, 'front'),
			rear: new Wheel(17, {profile: 190, aspect: .55}, 'rear')
		},
		specs = {wheelbase: 1405, seatHeight: 810, groundClearance: 125},
		gixxer = new Bike('Suzuki', 'GSX-R 1000', 2006, wheels, specs);

	console.log(gixxer.wheels.front.fullHeight)
	console.log(gixxer.wheels.rear.fullHeight)
	console.log(gixxer.fullName)

	console.log(gixxer)

})

