#!/bin/sh

    ls -al
    sudo apt-get update
    sudo apt-get install unzip -y
    sudo apt-get install nodejs -y
    sudo apt-get install npm -y
    ls -al
    pwd
    echo "Creating group and user"
    sudo groupadd csye6225
    sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
    sudo unzip -d /opt/csye6225/webapp1 webapp1.zip
    ls -al
    pwd
    cd /opt/csye6225/webapp1 || exit
    ls -al
    sudo cp users.csv /opt
    if [ $? -eq 0 ]; then
    echo "=============================== moved users into /opt ==============================="
    else
    echo "=============================== failed to move users to /opt ==============================="
    fi

    echo "STARTING SYSTEMD COMMANDS"
    echo "Copying systemd.service file to /etc/systemd/system/"
    sudo cp systemd.service /etc/systemd/system/

    # Modifying Permissions
    sudo chown -R csye6225:csye6225 /opt/csye6225/webapp1
    
    echo "STARTING MYWEBAPP"
    sudo systemctl enable systemd
    sudo systemctl start systemd

    # wget cloud watch
    sudo wget https://amazoncloudwatch-agent.s3.amazonaws.com/debian/amd64/latest/amazon-cloudwatch-agent.deb
    if [ $? -eq 0 ]; then
        echo "=============================== fetched cloudwatch deb file ==============================="
    else
        echo "=============================== failed to fetch cloudwatch deb file ==============================="
    fi
    
    # installing cloud watch
    sudo dpkg -i -E amazon-cloudwatch-agent.deb
    if [ $? -eq 0 ]; then
        echo "=============================== installed cloud watch ==============================="
    else
        echo "=============================== failed to install cloud watch ==============================="
    fi
    
    # Copy the CloudWatch Agent configuration file
    sudo cp /opt/csye6225/webapp1/amazon-cloudwatch-agent.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
    if [ $? -eq 0 ]; then
        echo "=============================== Copied the CloudWatch Agent configuration file ==============================="
    else
        echo "=============================== failed to Copy the CloudWatch Agent configuration file ==============================="
    fi
    
    # # Fetch and apply the CloudWatch Agent config
    # sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s
    # if [ $? -eq 0 ]; then
    #     echo "=============================== Fetched and applied the CloudWatch Agent configuration ==============================="
    # else
    #     echo "=============================== failed to Fetch and apply the CloudWatch Agent configuration ==============================="
    # fi
    
    # # Start the CloudWatch Agent
    # sudo systemctl start amazon-cloudwatch-agent
    # if [ $? -eq 0 ]; then
    #     echo "=============================== CloudWatch Agent Started ==============================="
    # else
    #     echo "=============================== failed to Start the CloudWatch Agent ==============================="
    # fi
    
    sudo apt-get purge -y git
    