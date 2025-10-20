import 'dotenv/config'

const CONFIG = {
    app: {
        name: process.env.APP_NAME || 'TodoApp',
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    }
};

export { CONFIG };