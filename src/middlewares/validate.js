    
export const validate = (schema) => {
    return (req,res,next) => {
        const result = schema.safeParse ({
            body: req.body,    
            params: req.params,
            query: req.query,
        });
      
        if (!result.success) {
            const msg = result.error.issues[0].message;
            return res.status (400).json ({
                success: false,
                msg
            });
        }
         next();
    };
}