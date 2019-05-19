if (process.env.environment === 'production') {
    let dbUrl = `mysql://${process.env.dbUsername}:${process.env.dbPassword}@${process.env.dbIp}/college`
    process.env.port = 80;
    module.exports = dbUrl;
} else {
    process.env.port = 3000;
    module.exports = "mysql://admin:1234@localhost:3306/college"
}