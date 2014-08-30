/**
 * Mongoose schema for a mission.
 * This is used as a sub-schema in Visit and not as an independent model
 */

'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('./Person');
var Person = mongoose.model('Person');

/**
 * All the available mission types
 * @type {string[]}
 */
var MISSION_TYPES = [
    'addLocation',
    'visitBonus',
    'hasOptions',
    'whatOptions',
    'buyOptions',
    'giveFeedback',
    'rateOptions'
];

/**
 * Map of mission types to the number of points it gives
 * @type {{}}
 */
var POINTS_BY_TYPE = {
    addLocation:  10,
    visitBonus:  100, // TODO: make sure visitBonus is not claimed when it wasn't available
    hasOptions:   10,
    whatOptions:  10,
    buyOptions:   20,
    giveFeedback: 20,
    rateOptions:  10
};

var missionSchema = new Schema({
    type: { type: String, enum: MISSION_TYPES, required: true },
    outcome: { type: Schema.Types.Mixed, required: true },
    points: { type: Schema.Types.Mixed }
});

missionSchema.pre('save', function(next) {
    var mission = this;
    var visit = mission.parent();

    // validate points
    // FIXME: Test that this indeed catches errors. Jonas suspects it might not really work.
    Person.findById(visit.person, function(err, person) {
        if (err) { return next(err); }

        _.forOwn(mission.points, function(p, t) {
            if (p < 0 || p > POINTS_BY_TYPE[mission.type] || p !== Math.round(p)) {
                return next(new Error('Invalid points for mission of type ' + mission.type + ': ' + p));
            }
            if (t !== person.team) {
                return next(new Error('Mission points attributed to wrong team: ' + t + ' instead of ' + person.team));
            }
        });

        return next();
    });
});

module.exports = missionSchema;