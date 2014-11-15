 
//$(document).ready(function() {
	var controls = {};
	var sensors = {};
	var chart = {};

    controls['xSlider'] = $("#x-slider").kendoSlider({
		increaseButtonTitle: "Right",
		decreaseButtonTitle: "Left",
		tickPlacement: "topLeft",
		change: function(e){ socket.emit('controls', { 'xSlider': e.value }); },
		slide: function(e){ socket.emit('controls', { 'xSlider': e.value }); },
		min: -90,
		max: 90,
		smallStep: 5,
		largeStep: 45
	}).data("kendoSlider");
	
    controls['ySlider'] = $("#y-slider").kendoSlider({
		orientation: "vertical",
		increaseButtonTitle: "Up",
		decreaseButtonTitle: "Down",
		tickPlacement: "topLeft",
		change: function(e){ socket.emit('controls', { 'ySlider': e.value }); },
		slide: function(e){ socket.emit('controls', { 'ySlider': e.value }); },
		min: -45,
		max: 45,
		smallStep: 5,
		largeStep: 45
	}).data("kendoSlider");

	sensors['motionGauge'] = $("#motion-gauge").kendoRadialGauge({
		theme: "black",
		scale: { 
			min: 0, 
			max: 10,
			ranges: [
				{
					from: 4,
					to: 6,
					color: "#ffc700"
				}, {
					from: 6,
					to: 8,
					color: "#ff7a00"
				}, {
					from: 8,
					to: 10,
					color: "#c20000"
				}
			]
		},
		pointer: {
			animation: {
				speed: 30
			}
		}
	}).data("kendoRadialGauge");
	/*
	var viewModel = kendo.observable({
		selectedNumber: 0,
		isVisible: true
	});
	kendo.bind($("#motion-gauge"), viewModel);
	*/
	
	chart = $("#chart").kendoChart({
		theme: "black",
		series: [{
			name: "Motion Level", 
			data: [5, 8, 3, 1, 3, 6, 9, 4, 4, 1, 0, 0, 2, 9, 10, 10, 8, 7, 1, 5],
			style: "smooth",
			markers: { visible: true, size: 2 }
		}],
		seriesDefaults: { type: "line" },
		legend: { position: "bottom" },
		width: 600,
		chartArea: {
			height: 250
		},
		tooltip: {
			visible: true,
			format: "N0"
		}
	}).data("kendoChart");
//});