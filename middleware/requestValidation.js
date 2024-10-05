/**
 * Middleware to validate request data against a schema.
 * Responds with 400 if validation fails, or 500 for unexpected errors.
 */
export const validation = (schema) => {
    return (req, res, next) => {
      try {
        const validationArray = [];
        const methods = ['body', 'params', 'headers', 'query', 'file'];
  
        methods.forEach((key) => {
          if (schema[key]) {
            const data = req[key];
            const validationResult = schema[key].validate(data, { abortEarly: false });
  
            if (validationResult.error) {
              validationArray.push(validationResult.error.details);
            }
          }
        });
  
        if (validationArray.length > 0) {
          return res.status(400).json({ message: 'Validation error', errors: validationArray });
        }
  
        next();
      } catch (error) {
        return res.status(500).json({ message: 'Catch error', error });
      }
    };
  };
  