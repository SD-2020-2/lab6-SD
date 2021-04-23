#!/bin/bash
# Crea una instancia

echo "Creando instancia ... "

# Obtener el nombre del ultimo contenedor creado a partir de la imagen de instance
latest_container=$(docker ps -a -l --format {{.Names}} --filter ancestor=instance)

# Substring del nombre, para obtener el numero de puerto siguiente
latest_port=$(echo "$latest_container" | cut -c 9-10)

# Puerto incrementado
incremented_port=$(("$latest_port + 1"))

# Crear el contenedor en puerto calculado, si no habia antes ninguno crea el primero
if [[ -n $incremented_port ]]; then
    docker run -d -p 808"$incremented_port":8080 --name instance"$incremented_port" instance
    echo "Instancia "$incremented_port" creada y corriendo en el puerto 808"$incremented_port" !"
else
    echo ""
    echo "No existen contenedores SERVER, creando el primero ..."
    docker run -d -p 8081:8080 --name instance1 instance
    echo "Instancia 1 creada y corriendo en el puerto 8081 !"
fi

echo "-------------------------------------------------"

# Detener todos los contenedores
#docker stop $(docker ps -a -q)

# Eliminar todos los contenedores detenidos
#docker rm $(docker ps -a -q)

# Ver los puertos de los contenedores
#docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.State}}"

# Crear la imagen
#docker build -t instance .

# Ver las ips de los contenedores
#docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -q)