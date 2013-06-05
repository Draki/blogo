#! /bin/sh
cat > config.json <<EOF
{
"username": "$DATABASE_USER",
"password": "$DATABASE_PASSWORD",
"database": "$DATABASE_NAME",
"host": "$DATABASE_HOST",
"dialect": "$DATABASE_DIALECT",
"port": "$DATABASE_PORT",
"protocol": "$DATABASE_PROTOCOL",
"storage": "$DATABASE_STORAGE",
"omitNull": true
}
EOF