import winston from 'winston';

const logger = winston.createLogger({
    format: winston.format.cli(), 
    level: process.env.BGMI_DEBUG ? 'debug' : 'info',
    transports: [
        new winston.transports.Console()
    ]
});

export default logger;