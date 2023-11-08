packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}


variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0c5c5cf90bdd60078"
}

variable "db_root_password" {
  type    = string
  default = "Pa55w0rd@1"
}


source "amazon-ebs" "my-ami" {
  ami_name        = "csye6225_f23_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  instance_type   = "t3.medium"
  region          = "${var.aws_region}"
  ssh_username    = "${var.ssh_username}"
  subnet_id       = "${var.subnet_id}"
  ami_description = "AMI for CSYE 6225 Assignment5"
  ssh_timeout     = "20m"

  ami_users = [
    "184985182931",
    "644559974701",
  ]

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 8
    volume_type           = "gp2"
  }

  source_ami_filter {
    filters = {
      name                = "debian-12-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
      architecture        = "x86_64"
    }
    most_recent = true
    owners      = ["aws-marketplace"]
  }
}


build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {
    source      = "webapp1.zip"
    destination = "/home/admin/webapp1.zip"
  }

  provisioner "shell" {
   environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1",
    ]
    script = "scripts/build.sh"
  } 

}
