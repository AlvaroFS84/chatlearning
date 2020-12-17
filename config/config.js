require('custom-env').env(process.env.NODE_ENV)

const config = {
    port: process.env.PORT || 3000, 
    db_connect: process.env.DB_CONNECT,
    session_secret:process.env.SESSION_SECRET,
    google_consumer_key: process.env.GOOGLE_CONSUMER_KEY,
    google_consumer_secret: process.env.GOOGLE_CONSUMER_SECRET,
    google_callback:process.env.GOOGLE_CALLBACK
}
module.exports = config