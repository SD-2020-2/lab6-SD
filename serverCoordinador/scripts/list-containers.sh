#!/bin/bash
# Lista las ips de los contenedores

docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -q --filter ancestor=instance)