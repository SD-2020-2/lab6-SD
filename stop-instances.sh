#!/bin/bash

echo "Deteniendo instancias ... "
docker stop $(docker ps -q)
echo "Eliminando instancias detenidas ... "
docker rm $(docker ps -a -q)

echo ""
echo "Recreando imagen ... "
docker rmi instance
docker build -t instance .

echo " ... "
echo " Imagen instance creada ! "