module.exports = {
    servers: {
        one: {
            host: "gaiaxplorers.net",
            username: "ubuntu",
            pem: '/home/christian/.ssh/id_rsa'
        }
    },

    meteor: {
        name: 'gaiaxplorers',
        path: './meteor',
        servers: {
            one: {}
        },
        env: {
            ROOT_URL: 'https://gaiaxplorers.net',
            MONGO_URL: 'mongodb://localhost/meteor'
        },
        ssl: {
            crt: "./certs/fullchain.pem",
            key: "./certs/privkey.pem",
            port: 443
        },
        dockerImage: 'christiankiely/meteord:base',
        sslDockerImage: 'christiankiely/mup-frontend-server:latest',
        deployCheckWaitTime: 60,
        enableUploadProgressBar: true
    },

    mongo: {
        oplog: true,
        port: 27017,
        servers: {
            one: {}
        }
    }
};
