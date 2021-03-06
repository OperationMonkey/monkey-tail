'use strict';
var _ = require('lodash');
var constants = require('../utils/constants');
var ratingModelAddOn = require('../utils/ratingModelAddOn');

module.exports = function(sequelize, DataTypes) {
    var Product = sequelize.define('product');

    var productSchema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        availability: {
            type: DataTypes.ENUM,
            values: Object.keys(constants.PRODUCT_AVAILABILITIES),
            defaultValue: constants.PRODUCT_AVAILABILITIES.unknown,
            allowNull: false
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        locationId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    };

    var productOptions = {
        sequelize: sequelize
    };

    // Add the rating to the model definition
    ratingModelAddOn('rating', 1, 5, DataTypes, Product, productSchema, productOptions);

    // Initialise the model
    Product.init(productSchema, productOptions);

    Product.associate = function(models) {
        Product.belongsTo(models.Location);
        Product.hasMany(models.Task);
    };

    Product.hook('beforeSave', function(product) {
        // Make sure isAvailable is in sync with the availability enum
        product.isAvailable = (product.availability !== constants.PRODUCT_AVAILABILITIES.not);
    });

    /**
     * Static method that returns the sorting string to be used when getting lists
     * of products.
     * @returns {[]}
     */
    Product.getDefaultSorting = function() {
        return [
            ['isAvailable', 'DESC'],
            ['ratingRank', 'DESC'],
            ['ratingCount', 'DESC'],
            ['name', 'ASC']
        ];
    };

    /**
     * Method to notify the product that a task has been completed.
     * Will update the correct values on the product.
     * @param {Task} task
     * @param {Task} previousTask
     */
    Product.prototype.onTaskCompleted = function(task, previousTask) {
        switch(task.type) {
        case constants.TASK_TYPES.RateProduct:
            // Replace or add the rating
            if (_.isObject(previousTask)) {
                this.replaceRating(previousTask.outcome.rating, task.outcome.rating);
            }
            else {
                this.addRating(task.outcome.rating);
            }
            break;

        case constants.TASK_TYPES.SetProductAvailability:
            // TODO: Implement a way to completely delete products. For now the "not" available products are just shown at the end always.
            this.availability = task.outcome.availability;
            break;

        case constants.TASK_TYPES.SetProductName:
            this.name = task.outcome.name;
            break;
        }

        // Save the new state
        return this.save();
    };

    /**
     * Convert the product for transferring over the API
     * @returns {{}}
     */
    Product.prototype.toJSON = function () {
        var doc = this.get();
        var ret = _.pick(doc, [
            'id',
            'name',
            'description',
            'availability'
        ]);

        // Expose the location id as "location"
        if (doc.locationId) {
            ret.location = doc.locationId;
        }

        // Add the rating
        ret.rating = {
            average: doc.ratingAverage,
            numRatings: doc.ratingCount
        };

        return _.omit(ret, _.isNull);
    };

    return Product;
};
