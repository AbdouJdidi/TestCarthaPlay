const crypto  = require ('crypto')

const SECRET_KEY  = process.env.HMAC_SECRET ;

const hmacInterceptor = (req , res , next) =>{
    try {
        const signature = req.headers['x-signature'];

        if(!signature) {
            return res.status(401).json({error : 'Missing HMAC signature '})
        }

        const payload = {
            ...(req.params || {}),
            ...(req.body || {}),
        };

        
        const computedSignature = crypto
        .createHmac('sha256',SECRET_KEY)
        .update(JSON.stringify(payload))
        .digest('hex')

        if(computedSignature !== signature){
            return res.status(403).json({error : 'invalid signature'})
        }

        next();

    } catch (error) {
        
        console.error('HMAC verif failed',error);
        return res.status(500).json({error : 'internal server error'})
    }
}

module.exports = hmacInterceptor