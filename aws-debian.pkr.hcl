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
  ami_users    = ["822421370804"] # Replace with the DEMO AWS Account ID 822421370804 112ss822421370804
}

build {
  sources = ["source.amazon-ebs.webapp"]

  provisioner "shell" {
    script = "./setup-database.sh"
  }


  provisioner "file" {
    source      = "webapp.zip"
    destination = "/home/admin/test/webapp.zip"
  }

  provisioner "shell" {
    inline = [
      "sudo apt-get install unzip", # Making sure unzip is installed
      "cd /home/admin/test",
      "unzip webapp.zip", # Unzip the webapp.zip
      "ls -l ",
      "npm install", # Install dependencies
      # "npm test"
      # "node server.js" # Start the server
    ]
  }


  provisioner "shell" {
    inline = [
      "sudo apt clean",
      "sudo rm -rf /var/lib/apt/lists/*"
    ]
  }
}
