const crypto  = require ('crypto');

const SECRET_KEY  = process.env.HMAC_SECRET;

const hmacInterceptor = (req, res, next) => {
    try {
        const signature = req.headers['x-signature'];

        if (!signature) {
            return res.status(401).json({ error: 'Missing HMAC signature' });
        }

        // Log signature to compare
        console.log('Received signature: ', signature);

        const payload = {
            ...(req.params || {}),
            ...(req.body || {}),
        };

        const message = JSON.stringify(payload);
console.log('Payload to sign (backend):', message);

        const computedSignature = crypto
            .createHmac('sha256', SECRET_KEY)
            .update(JSON.stringify(payload))
            .digest('hex');

        // Log computed signature to compare
        console.log('Computed signature: ', computedSignature);

        if (computedSignature !== signature) {
            return res.status(403).json({ error: 'Invalid HMAC signature' });
        }

        next();
    } catch (error) {
        console.error('HMAC verification failed:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = hmacInterceptor;
