#!/bin/bash
# Checks the status of a container

docker ps -a --format "table {{.Names}}-{{.State}}"