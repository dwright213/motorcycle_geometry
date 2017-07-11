$(document).ready( function(){

	var
		linearScale = d3.scaleLinear().domain([0,2000]).range([0,1000]),

		playPlace = $('#play-place'),
		height = playPlace.attr('height'),
		
		// initialize SVG.js
		draw = SVG('play-place'),

		frontWheelX = linearScale(266), // close to 266, which is roughly a 20 inch wheel's radius in millimeters.
		wheelData = [linearScale(432), linearScale(432)],
		wheelbase = [0, 1324],
		tireHeights = [linearScale(120*.70), linearScale(190*.55)]
		colors = ['hsla(337, 0%, 50%, 0.75)', 'hsla(337, 0%, 50%, 0.75)'],
		positions = ['front', 'rear'];


	class Wheel {
		constructor(diameter, tire, position) {
			this.size = {inches: diameter, mm: diameter*25.4}
			this.tire = tire
			this.position = position
		}
		get fullHeight() {
			return this.size.mm + (this.tire.profile * this.tire.aspect)
		}
		get fullRadius() {
			return (this.size.mm + (this.tire.profile * this.tire.aspect))/2
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
		
	var
		wheels = {
			front: new Wheel(17, {profile: 120, aspect: .70}, 'front'),
			rear: new Wheel(17, {profile: 190, aspect: .55}, 'rear')
		},
		specs = {wheelbase: 1405, seatHeight: 810, groundClearance: 125},
		gixxer = new Bike('Suzuki', 'GSX-R 1000', 2006, wheels, specs);


	function scaled(dataSet) {
		return linearScale(dataSet)
	}

	function create(bike) {
		console.log(height)


		var 
			frontWheel = draw.circle(scaled(bike.wheels.front.fullHeight)),
			backWheel = draw.circle(scaled(bike.wheels.rear.fullHeight)),
			ground = draw.line(frontWheelX - scaled(bike.wheels.fullRadius), 100, 100, 0)//.move(20, 20);

  
			ground.stroke({ color: '#f06', width: 10, linecap: 'round' })

			frontWheel.fill('#f06').center(frontWheelX, height/2)
			backWheel.fill('#6f6').center(frontWheelX + scaled(bike.specs.wheelbase), height/2)


				// .move(scaled(bike.fullRadius), scaled(bike.fullRadius))




		// d3.select('svg').selectAll('circle')
		// 	.data([bike.wheels.front, bike.wheels.rear])
		// 	.enter()
		// 	.append('circle')
		// 	.attr('cx', function(d){return scaled(d.fullRadius)})
		// 	.attr('cy', height/2)
		// 	.attr('r', function(d){return scaled(d.fullRadius)})
		// 	.attr('fill', 'red')

		// d3.select('svg').selectAll('circle')	
		// 	.data(tireHeights)
		// 	.attr('stroke', 'hsla(337, 0%, 50%, 0.75)')
		// 	.attr('stroke-width', function(d){return d})

		// d3.select('svg').selectAll('circle')
		// 	.data(colors)
		// 	.attr('fill', function(d){return d})

		// d3.select('svg').selectAll('circle')
		// 	.data(positions)
		// 	.attr('class', function(d){return d})

		// d3.select('svg').selectAll('circle')
		// 	.data(scaled(wheelbase))
		// 	.attr('cx', function(d){if(d>0){return d-(scaled(wheelData)[0]/2)}else{return frontWheelX}})
	}

	// create()
	create(gixxer)
	$('a').on('click', function(e) {
		e.preventDefault()
		// wheelbase = [0, $(this).data('wheelbase')]
		create(gixxer)

	})




// fzr = new Bike('Yamaha', 'fzr400', 1990),
// console.log(fzr.fullName)

	// console.log(gixxer.wheels.front.fullHeight)
	// console.log(gixxer.wheels.rear.fullHeight)
	// console.log(gixxer.fullName)

	// console.log(gixxer)

})

