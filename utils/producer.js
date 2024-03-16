const { Queue } = require('bullmq');
const IORedis = require('ioredis');

const emailQueue = new Queue('email_queue', {
    connection: new IORedis(process.env.REDIS_URIfulle)
});

async function addJobToQueue(email, subject, body) {
    const res = await emailQueue.add('email to retail', {
        email,
        subject,
        body
    })
    // console.log("job added to queue", res.id);
}

module.exports = addJobToQueue;
