$(document).ready( function(){

	var
		// continue with d3's linear scaler for now.
		linearScale = d3.scaleLinear().domain([0,2500]).range([0,1000]),
		
		// initialize SVG.js
		draw = SVG('play-place'),

		playPlace = $('#play-place'),
		width = playPlace.attr('width'),
		height = playPlace.attr('height'),
		buttonDiv = $('#moto-buttons'),

		// this is probably gonna stay the same.
		groundWidth = 4,
		ground = draw.line(0, height, width, height).stroke({ color: '#000', width: groundWidth, linecap: 'round' }),
		
		// let's set our left-most point about a scale half-meter away from the left edge of the screen.
		frontAxle = scaled(500);


	class Wheel {
		constructor(diameter, tire, position) {
			this.size = {inches: diameter, mm: diameter*25.4}
			this.tire = {profile: tire.profile, aspect: tire.aspect/100}
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
		get id() {
			return `${this.make}-${this.model}-${this.year}`.replace(/\s+/g, '')
		}

		get fullName() {
			return `${this.make} ${this.model}, ${this.year}` 
		}
	}
		
	// var
	// 	wheels = {
	// 		front: new Wheel(17, {profile: 120, aspect: 70}, 'front'),
	// 		rear: new Wheel(17, {profile: 190, aspect: 55}, 'rear')
	// 	},
	// 	specs = {wheelbase: 1405, seatHeight: 810, groundClearance: 125},
	// 	gixxer = new Bike('Suzuki', 'GSX-R 1000', 2006, wheels, specs);


	function scaled(dataSet) {
		return linearScale(dataSet)
	}

	function gravity(itemHeight) {
		return (height - (itemHeight/2)) - groundWidth/2
	}

	function create(bike) {
		// apply our data to some shapse:
		var 
			colors = {
				Yamaha: 'hsla(235, 100%, 50%, 0.7)',
				Honda: 'hsla(360, 100%, 50%, 0.7)',
				Suzuki: 'hsla(59, 100%, 50%, 0.7)'
			},

			frontHeight = scaled(bike.wheels.front.fullHeight),
			rearHeight = scaled(bike.wheels.rear.fullHeight),
			wheelBase = scaled(bike.specs.wheelbase),
			
			frontWheel = 
				draw.circle(frontHeight)
						.fill(colors[bike.make])
						.center(frontAxle, gravity(frontHeight))
						.attr({id: bike.id}),

			rearWheel = 
				draw.circle(rearHeight)
						.fill(colors[bike.make])
						.center(frontAxle + wheelBase, gravity(rearHeight))
						.attr({id: bike.id});
			
			console.log(frontWheel)
	}

	function bikeBuilder(bikes) {
		console.log(bikes)
		var allBikes = [];

		for (var i = 0; i < bikes.length; i++) {
			var 
				objBike = bikes[i],
				objWheels = objBike.wheels,
				
				theseWheels = {
					front: new Wheel(
						objWheels.front.size, 
						{
							profile: objWheels.front.tire.profile,
							aspect: objWheels.front.tire.aspect
						},
						objWheels.front.position
					),
					
					rear: new Wheel(
						objWheels.rear.size, 
						{
							profile: objWheels.rear.tire.profile,
							aspect: objWheels.rear.tire.aspect
						},
						objWheels.rear.position
					)
				},
				thisBike = new Bike(
					objBike.name.make, 
					objBike.name.model, 
					objBike.name.year, 
					theseWheels, 
					objBike.specs
				);
			makeButton(thisBike)
			allBikes.push(thisBike)	
		}
		return allBikes;
		console.log(allBikes)

	}


	$('a#go').on('click', function(e) {
		var motorcycles = bikeBuilder(bieks);
		e.preventDefault()

		for (var i = 0; i < motorcycles.length; i++) {
			create(motorcycles[i])
		}

		addViewEvents()
	})

	function addViewEvents() {
		$('a.view').on('click', function(e) {
			console.log(this.id)
			var
				allTheWheels = SVG.select('circle'), 
				wheels = SVG.select('circle#' + this.id);
			allTheWheels.attr({'fill-opacity': .20})
			wheels.front().attr({'fill-opacity': 100})
		})
	}

	function makeButton(moto) {
		var 
			button = `
				<a href="#" class="view" id="${moto.id}">
					${moto.fullName}
				</a>
				<br>`;
		buttonDiv.append(button);
	}




var 
	bieks = [{
		"name": {
			"make": "Suzuki",
			"model": "GSX-R 1000",
			"year": "2006"
		},

		"specs": {
			"wheelbase": 1405,
			"seatHeight": 810,
			"groundClearance": 125
		},

		"wheels": {
			"front": {
				"size": 17,
				"position": "front",
				"tire": {
					"profile": 120,
					"aspect": 70
				}
			},
			"rear": {
				"size": 17,
				"position": "rear",
				"tire": {
					"profile": 190,
					"aspect": 55
				}
			}
		},

	}, {
		"name": {
			"make": "Yamaha",
			"model": "TZ-250",
			"year": "2002"
		},

		"specs": {
			"wheelbase": 1345,
			"seatHeight": 773,
			"groundClearance": 119
		},
		"wheels": {
			"front": {
				"size": 17,
				"position": "front",
				"tire": {
					"profile": 120,
					"aspect": 60
				}
			},
			"rear": {
				"size": 17,
				"position": "rear",
				"tire": {
					"profile": 165,
					"aspect": 55
				}
			}
		}
	}, {
		"name": {
			"make": "Honda",
			"model": "Grom",
			"year": "2015"
		},

		"specs": {
			"wheelbase": 1199,
			"seatHeight": 754,
			"groundClearance": 165
		},
		"wheels": {
			"front": {
				"size": 12,
				"position": "front",
				"tire": {
					"profile": 120,
					"aspect": 70
				}
			},
			"rear": {
				"size": 12,
				"position": "rear",
				"tire": {
					"profile": 130,
					"aspect": 70
				}
			}
		}
	}, {
		"name": {
			"make": "Honda",
			"model": "CB1000C",
			"year": "1983"
		},

		"specs": {
			"wheelbase": 1626,
			"seatHeight": 813,
			"groundClearance": 178
		},
		"wheels": {
			"front": {
				"size": 18,
				"position": "front",
				"tire": {
					"profile": 110,
					"aspect": 90
				}
			},
			"rear": {
				"size": 16,
				"position": "rear",
				"tire": {
					"profile": 140,
					"aspect": 90
				}
			}
		}
	}];

})

