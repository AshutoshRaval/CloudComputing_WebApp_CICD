#!/bin/bash
# # Update and upgrade the system
sudo apt update && sudo apt -y upgrade

# # Install Node.js, npm, MariaDB server, and client
sudo apt -y install nodejs npm mariadb-server mariadb-client
# sudo apt -y install nodejs npm



# # Start and enable MariaDB
# sudo systemctl start mariadb
# sudo systemctl enable mariadb

# # Check if MariaDB is running
# if sudo systemctl is-active --quiet mariadb; then
#     echo "MariaDB is running."
# else
#     echo "MariaDB is not running. Starting and enabling MariaDB..."
#     sudo systemctl start mariadb
#     sudo systemctl enable mariadb
#     echo "MariaDB started and enabled."
# fi

# # Create a database if it doesn't exist
# DB_NAME="TestDataBase1"

# if sudo mysql -u root -e "USE $DB_NAME" 2>/dev/null; then
#     echo "Database $DB_NAME already exists."
# else
#     echo "Creating database $DB_NAME..."
#     sudo mysql -u root -proot -e "CREATE DATABASE $DB_NAME;"
#     sudo mysql -u root -proot -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO 'root'@'localhost' IDENTIFIED BY 'root';"
#     sudo mysql -u root -proot -e "FLUSH PRIVILEGES;"
#     sudo mysql -u root -proot -e "SHOW DATABASES;"
#     echo "Database $DB_NAME created."

# fi

# sudo adduser ec2-user
# echo 'ec2-user:ec2User' | sudo chpasswd
# sudo usermod -aG ec2-user ec2-user
# sudo chmod +x /home/admin/server.js

# sudo mv /tmp/webapp.service /etc/systemd/system/
# sudo systemctl daemon-reload
# sudo systemctl enable webapp
# sudo systemctl start webapp

