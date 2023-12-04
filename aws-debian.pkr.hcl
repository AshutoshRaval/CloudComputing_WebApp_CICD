variable "aws_profile" {
  type    = string
  default = "dev"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami_owner" {
  type    = string
  default = "372558015288"

}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = "~> 1"
    }
  }
}

source "amazon-ebs" "webapp" {
  profile       = var.aws_profile
  ami_name      = "webapp-ami-${local.timestamp}"
  instance_type = var.instance_type
  region        = var.region

  source_ami   = "ami-06db4d78cb1d3bbf9"
  ssh_username = var.ssh_username
  ami_users    = ["822421370804"]
}

build {
  sources = ["source.amazon-ebs.webapp"]

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/home/admin/webapp.zip"
  }

  provisioner "shell" {
    script = "./setup-database.sh"
  }

  provisioner "shell" {
    inline = [
      "sudo apt-get update -y",
      "sudo apt-get install unzip -y", # Install unzip
      "cd /home/admin",
      # "cd /opt",
      "unzip webapp.zip", # Unzip the webapp.zip
      # "sudo unzip webapp.zip -d csye6225"
      "npm install", # Install Node.js dependencies
      "sudo apt-get install acl",
      "yes | sudo adduser ec2-user",
      "yes | echo 'ec2-user:ec2-user1234' | sudo chpasswd",
      "yes | sudo usermod -aG ec2-user ec2-user",
      "sudo chmod +x /home/admin/server.js",
      "sudo setfacl -Rm u:ec2-user:rwx /home/admin",
      "sudo mv /home/admin/webapp.service /etc/systemd/system/",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable webapp.service",
    ]
  }

  provisioner "shell" {
    inline = [
      "echo 'Installing CloudWatch Agent'",
      "sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb",
      "sudo dpkg -i -E ./amazon-cloudwatch-agent.deb",
      "echo 'CloudWatch Agent Installed'",
      # Move the cloudwatch-config.json from the webapp directory to the CloudWatch agent configuration directory
      # "sudo cp /home/admin/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/bin/",
      # "sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \ -a fetch-config \ -m ec2 \ -c file:/home/admin/cloudwatch-config.json \ -s",
      "sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/admin/cloudwatch-config.json -s",
      # "sudo chown root:root /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",
      # "sudo chmod 640 /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",

      "sudo systemctl enable amazon-cloudwatch-agent",
      # Start CloudWatch agent
      "sudo systemctl start amazon-cloudwatch-agent",
      "sudo chown -R ec2-user:ec2-user /home/admin/*",
      "sudo chmod -R 750 /home/admin/*",

    ]
  }

  provisioner "shell" {
    inline = [
      "sudo apt clean",
      "sudo rm -rf /var/lib/apt/lists/*"
    ]
  }
  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
  }
}
