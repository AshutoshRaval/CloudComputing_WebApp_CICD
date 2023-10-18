#!/bin/bash

# if [ -f .env ]; then
#   source .env
# else
#   echo ".env file not found. Make sure to create it."
#   exit 1
# fi
source .env
echo "Database name: $DB_NAME"
echo "Database user: $DB_USER"

#!/bin/bash

# ENV_FILE="./.env"

# if [ -f "$ENV_FILE" ]; then
#   while IFS= read -r line; do
#     export "$line"
#   done < "$ENV_FILE"
#   echo "Read variables from .env file successfully."
#   # Now you can access the variables defined in .env
#   echo "DB_NAME: $DB_NAME"
#   echo "DB_USER: $DB_USER"
#   # ...
# else
#   echo ".env file not found. Make sure to create it."
#   exit 1
# fi

# You can use the variables in your script
# For example:
# mysql -u $DB_USER -p$DB_PASSWORD -e "USE $DB_NAME; SELECT * FROM table_name;"


# Update and upgrade the system
sudo apt update && sudo apt -y upgrade

# Install Node.js, npm, MariaDB server, and client
sudo apt -y install nodejs npm mariadb-server mariadb-client

# Start and enable MariaDB
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Check if MariaDB is running
if sudo systemctl is-active --quiet mariadb; then
    echo "MariaDB is running."
else
    echo "MariaDB is not running. Starting and enabling MariaDB..."
    sudo systemctl start mariadb
    sudo systemctl enable mariadb
    echo "MariaDB started and enabled."
fi

# Create a database if it doesn't exist
DB_NAME="TestDataBase1"

if sudo mysql -u root -e "USE $DB_NAME" 2>/dev/null; then
    echo "Database $DB_NAME already exists."
else
    echo "Creating database $DB_NAME..."
    sudo mysql -u root -p"$DB_PASSWORD" -e "CREATE DATABASE $DB_NAME;"
    sudo mysql -u root -p"$DB_PASSWORD" -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
    sudo mysql -u root -p"$DB_PASSWORD" -e "FLUSH PRIVILEGES;"
    sudo mysql -u root -p"$DB_PASSWORD" -e "SHOW DATABASES;"
    echo "Database $DB_NAME created."

fi