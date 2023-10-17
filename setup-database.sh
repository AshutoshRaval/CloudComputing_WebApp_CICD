# #!/bin/bash

# # Update and upgrade the system
# sudo apt update && sudo apt -y upgrade

# # Install Node.js, npm, MariaDB server, and client
# sudo apt -y install nodejs npm mariadb-server mariadb-client

# # Start and enable MariaDB
# sudo systemctl start mariadb
# sudo systemctl enable mariadb

# # # Secure the MariaDB installation
# # # Note: In production, utilize a more secure way of handling MySQL root password 
# # # such as using secret management tools or AWS Secrets Manager.
# # sudo mysql_secure_installation <<EOF
# # y
# # [YourRootPassword]
# # [YourRootPassword]
# # y
# # y
# # y
# # y
# # EOF

# # Setup database and user for your web app
# # Remember to replace [YourRootPassword] and [YourDBName] accordingly.

# sudo mysql -u  <<EOF
# CREATE DATABASE TestDataBase1;
# GRANT ALL PRIVILEGES ON TestDataBase1.* TO 'root'@'localhost' IDENTIFIED BY 'root';
# FLUSH PRIVILEGES;
# EXIT;
# EOF

# # You may further install and configure your web application below this line


#!/bin/bash

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
    sudo mysql -u root -p root -e "CREATE DATABASE $DB_NAME;"
    sudo mysql -u root -p root -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO 'root'@'localhost' IDENTIFIED BY 'root';"
    sudo mysql -u root -p root -e "FLUSH PRIVILEGES;"
    echo "Database $DB_NAME created."
fi

# You may further install and configure your web application below this line
