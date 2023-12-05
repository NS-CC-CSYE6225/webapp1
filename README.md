# webapp
Assignment 10
Network Structures and Cloud Computing

openssl genrsa -out demoaravindsankarcloud.key 2048

openssl req -new -key demoaravindsankarcloud.key -out demoaravindsankarcloud.csr

aws acm import-certificate --certificate fileb:///Users/aravindsankars/Downloads/demo_aravindsankar.cloud/demo_aravindsankar_cloud.crt --private-key fileb:///Users/aravindsankars/Downloads/demo_aravindsankar.cloud/privatekey.pem --certificate-chain fileb:///Users/aravindsankars/Downloads/demo_aravindsankar.cloud/demo_aravindsankar_cloud.ca-bundle
