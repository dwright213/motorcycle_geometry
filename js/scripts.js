$(document).ready( function(){

	var
		// continue with d3's linear scaler for now.
		linearScale = d3.scaleLinear().domain([0,2500]).range([0,1000]),
		
		// initialize SVG.js
		draw = SVG('play-place'),

		playPlace = $('#play-place'),
		width = playPlace.attr('width'),
		height = playPlace.attr('height'),

		// this is probably gonna stay the same.
		groundWidth = 4,
		ground = draw.line(0, height, width, height).stroke({ color: '#000', width: groundWidth, linecap: 'round' }),
		
		// let's set our left-most point about a scale half-meter away from the left edge of the screen.
		frontAxle = scaled(500);


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

	function gravity(itemHeight) {
		return (height - (itemHeight/2)) - groundWidth/2
	}

	function create(bike) {

		// apply our data to some shapse:
		var 
			frontHeight = scaled(bike.wheels.front.fullHeight),
			rearHeight = scaled(bike.wheels.rear.fullHeight),
			wheelBase = scaled(bike.specs.wheelbase),
			
			frontWheel = 
				draw.circle(frontHeight)
						.fill('#f06')
						.center(frontAxle, gravity(frontHeight)),

			rearWheel = 
				draw.circle(rearHeight)
						.fill('#6f6')
						.center(frontAxle + wheelBase, gravity(rearHeight));


			// frontWheel.fill('#f06').center(frontAxle, gravity(frontHeight))
			// rearWheel.fill('#6f6').center(frontAxle + wheelBase, gravity(rearHeight))


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

