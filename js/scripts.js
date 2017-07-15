$(document).ready( function(){

	var
		// our bike data
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
		}],

		// continue with d3's linear scaler for now.
		linearScale = d3.scaleLinear().domain([0,2500]).range([0,1000]),
		
		// initialize SVG.js
		draw = SVG('play-place'),

		playPlace = $('#play-place'),
		width = playPlace.attr('width'),
		height = playPlace.attr('height'),
		buttonDiv = $('#moto-buttons'),
		motoTable = $('#moto-table tbody'),
		motorcycles = [],

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
		constructor(make, model, year, wheels, specs, index, opacity) {
			this.make = make
			this.model = model
			this.year = year
			this.wheels = wheels
			this.specs = specs

			// display related stuff
			this.index = index
			this.opacity = opacity
		}
		get id() {
			return `${this.make}-${this.model}-${this.year}`.replace(/\s+/g, '')
		}

		get fullName() {
			return `${this.make} ${this.model}, ${this.year}` 
		}
	}
		

	function scaled(dataSet) {
		return linearScale(dataSet)
	}

	function gravity(itemHeight) {
		return (height - (itemHeight/2)) - groundWidth/2
	}

	function create(bike, index) {
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
						.attr({
							'class': bike.id, 
							'fill-opacity': bike.opacity,
							'data-index': index
						}),

			rearWheel = 
				draw.circle(rearHeight)
						.fill(colors[bike.make])
						.center(frontAxle + wheelBase, gravity(rearHeight))
						.attr({
							'class': bike.id, 
							'fill-opacity': bike.opacity,
							'data-index': index
						});
			
	}

	function bikeBuilder(bikes) {
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
					objBike.specs,
					i,
					.25
				);
			addRow(thisBike, i)
			allBikes.push(thisBike)	
		}
		return allBikes;
	}

	function makeAllBikes(){
		motorcycles = bikeBuilder(bieks)
		for (var i = motorcycles.length - 1; i >= 0; i--) {
			create(motorcycles[i], i)
		}
		addViewEvents()
	}

	makeAllBikes()
	addSorting()

	function setOpacity(id, opacity) {
		var 
			wheels = SVG.select('circle.' + id);
		wheels.attr({'fill-opacity': parseFloat(opacity)})
	}

	function addViewEvents() {
		$('input[type="radio"]').on('change', function(e) {
			var
				id = $(this).data('bike'),
				opacity = $(this).data('opacity');

				for (var i = 0; i < motorcycles.length; i++) {
					if (motorcycles[i].id == id) {
						motorcycles[i].opacity = opacity
					}
				}

			setOpacity(id, opacity)
		})
	}

	function addSorting() {
		var 
			bikeList = document.getElementById("bike-list"),

			sortable = Sortable.create(bikeList, {
				animation: 150,
				ghostClass: 'drag-ghost',
				chosenClass: 'table-successs',
				handle: ".sort-handle",
					onEnd: function (evt) {
					var bikeId = $(evt.item).data('bike');
					console.log(evt.from.children)
					indexReset(evt.from.children)
				}
			});
	}

	function indexReset(rows) {
		for (var i = 0; i < rows.length; i++) {
			rows[i].dataset.index = i;

			for (var j = 0; j < motorcycles.length; j++) {
				if (motorcycles[j].id == rows[i].dataset.bike) {
					motorcycles[j].index = rows[i].dataset.index
				}
			}
		}
		motorcycles.sort(function(a, b) { 
    	return a.index - b.index;
		})

		$('circle').remove()

		for (var i = motorcycles.length - 1; i >= 0; i--) {
			create(motorcycles[i], i)
		}
		addViewEvents()
	}
		


	function addRow(moto, index) {
		var
			row = `
				<tr data-bike="${moto.id}" data-index="${index}">
					<td><i class="fa fa-bars sort-handle" aria-hidden="true"></i></td>
					<td>${moto.model}</td>
					<td>
						<div class="form-check form-check-inline">
							<label class="form-check-label">
								<input class="form-check-input" type="radio" name="${moto.id}-opacity" data-opacity="0" data-bike="${moto.id}">
							</label>
						</div>
					</td>

					<td>
						<div class="form-check form-check-inline">
							<label class="form-check-label">
								<input class="form-check-input" type="radio" name="${moto.id}-opacity" data-opacity=".75" data-bike="${moto.id}"  checked="checked">
							</label>
						</div>
					</td>

					<td>
						<div class="form-check form-check-inline">
							<label class="form-check-label">
								<input class="form-check-input" type="radio" name="${moto.id}-opacity" data-opacity=".75" data-bike="${moto.id}">
							</label>
						</div>
					</td>

					<td>
						<div class="form-check form-check-inline">
							<label class="form-check-label">
								<input class="form-check-input" type="radio" name="${moto.id}-opacity" data-opacity="100" data-bike="${moto.id}">
							</label>
						</div>
					</td>
				</tr>
				`
		motoTable.append(row)

	}





})

