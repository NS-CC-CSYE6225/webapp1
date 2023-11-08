#!/bin/sh

    ls -al
    sudo apt-get update
    sudo apt-get install unzip -y
    sudo apt-get install nodejs -y
    sudo apt-get install npm -y
    sudo apt install -y mariadb-server
    sudo systemctl enable mariadb
    sudo systemctl start mariadb
    echo -e "\\n\\N\\nY\\n${var.db_root_password}\\n${var.db_root_password}\\nN\\nN\\nN\\nY\\n" | sudo mysql_secure_installation
    sudo mysql -uroot -p${var.db_root_password} -e "GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY '${var.db_root_password}' WITH GRANT OPTION; FLUSH PRIVILEGES;"
    ls -al
    pwd
    unzip -d webapp1 webapp1.zip
    ls -al
    pwd
    cd webapp1 || exit
    ls -al
    sudo cp users.csv /opt
    if [ $? -eq 0 ]; then
    echo "=============================== moved users into /opt ==============================="
    else
    echo "=============================== failed to move users to /opt ==============================="
    fi
    # wget cloud watch
    wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb
    if [ $? -eq 0 ]; then
        echo "=============================== fetched cloudwatch deb file ==============================="
    else
        echo "=============================== failed to fetch cloudwatch deb file ==============================="
    fi
    
    # installing cloud watch
    sudo dpkg -i amazon-cloudwatch-agent.deb
    if [ $? -eq 0 ]; then
        echo "=============================== installed cloud watch ==============================="
    else
        echo "=============================== failed to install cloud watch ==============================="
    fi
    
    # Copy the CloudWatch Agent configuration file
    sudo cp cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
    if [ $? -eq 0 ]; then
        echo "=============================== Copied the CloudWatch Agent configuration file ==============================="
    else
        echo "=============================== failed to Copy the CloudWatch Agent configuration file ==============================="
    fi
    
    # Fetch and apply the CloudWatch Agent configuration
    sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s
    if [ $? -eq 0 ]; then
        echo "=============================== Fetched and applied the CloudWatch Agent configuration ==============================="
    else
        echo "=============================== failed to Fetch and apply the CloudWatch Agent configuration ==============================="
    fi
    
    # Start the CloudWatch Agent
    sudo systemctl start amazon-cloudwatch-agent
    if [ $? -eq 0 ]; then
        echo "=============================== CloudWatch Agent Started ==============================="
    else
        echo "=============================== failed to Start the CloudWatch Agent ==============================="
    fi
    
    sudo apt-get purge -y git
    echo "STARTING SYSTEMD COMMANDS"
    echo "Copying systemd.service file to /etc/systemd/system/"
    sudo cp systemd.service /etc/systemd/system/
    echo "Creating group and user"
    sudo groupadd csye6225
    sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
    echo "STARTING MYWEBAPP"
    sudo systemctl enable systemd
    sudo systemctl start systemd