var mongoose = require("mongoose");

// plant Schema
var plantSchema = mongoose.Schema({
	name: String,
	image: String,
	information: {
		scientificName: String,
		classification: {
			phylum: String,
			class: String,
			order: String,
			family: String,
			genus: String,
			species: String
		},
		flowering: {
			start: Date,
			end: Date
		},
		sowing: {
			start: Date,
			end: Date
		},
		habitat: [String]
	},
	requirement: {
		difficulty: Number,
		height: {
			min: Number,
			max: Number
		},
		area: {
			min: Number,
			max: Number
		},
		temperature: {
			min: Number,
			max: Number
		},
		light: [String],
		soil: [String],
		ph: [String],
		drainage: String
	},
	guide: {
		climate: String,
		soil: String,
		propagation: [String],
		water: String,
		fertilizer: String,
		disease: [String]
	},
	comments: [{
		id: {type: Number, default: 0},
		author: {type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
		content: String,
		date: {type: Date, default: Date.now()},
		like: {type: Number, default: 0}
	}]
});

// model and export
var Plant = mongoose.model('plant', plantSchema);
module.exports = Plant;
