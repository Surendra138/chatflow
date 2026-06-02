const required = ['MONGO_URI', 'JWT_SECRET', 'PORT', 'CLIENT_URL'];

required.forEach((key) => {
    if(!process.env[key]) {
        console.error(`❌ Missing env var: ${key}`);
        process.exit(1);
    }
});