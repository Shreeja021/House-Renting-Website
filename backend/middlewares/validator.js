import Joi from 'joi';

const registerValidator = ( req, res, next ) => {
    try{
        const userSchema = Joi.object({
        firstName: Joi.string().min(1).max(30).required(),
        lastName: Joi.string().min(1).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(), // Ensure password is at least 6 characters
        phoneNumber: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required(), // Validate as numeric string, typically 10-15 digits
        avatar: Joi.string().uri().allow(null, '').optional()// Validate as optional URL
        });

        const { error } = userSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(`Error in registerValidator: ${error.message}`)
    }
}

  // Middleware function to validate request body
const propertyValidator = (req, res, next) => {
    const propertySchema = Joi.object({
        sellerId: Joi.string().required(), // Assuming sellerId is sent as string
        title: Joi.string().required(),
        description: Joi.string().required(),
        address: Joi.object({
          street: Joi.string().required(),
          city: Joi.string().required(),
          state: Joi.string().required(),
          postalCode: Joi.string().required(),
          country: Joi.string().required()
        }).required(),
        price: Joi.number().required(),
        numberOfBedrooms: Joi.number().required(),
        numberOfBathrooms: Joi.number().required(),
        area: Joi.number().required(), // in square feet
        amenities: Joi.array().items(Joi.string()).default([]), // Array of strings
        images: Joi.array().items(Joi.string()).default([]), // Array of image URLs
      });

      
        
    const { error } = propertySchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

export { registerValidator, propertyValidator }