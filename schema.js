const Joi = require('joi');

// For creating a new listing (image optional)
const ListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().min(0).required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: {
          url:Joi.string().required(),
        } 
    }).required()
});


//for validating reviews
const reviewSchema= Joi.object({
  review: Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()

  }).required(),
})

module.exports = {
    ListingSchema,
    reviewSchema
};
