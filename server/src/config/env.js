const required = ['MONGO_URI', 'JWT_SECRET', 'PORT'];

required.forEach((key) => {
    if(!process.env[key]) {
        console.error(`❌ Missing env var: ${key}`);
        process.exit(1);
    }
});