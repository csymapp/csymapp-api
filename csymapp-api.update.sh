#!/bin/bash

readConfig () {
	set -a 
	source .env
	set +a 
}

readConfig

checktime=$UPDATE_INTERVAL #1 hour	 #time in minutes after which to check for new updates

#times in seconds
checktime=$((checktime * 60))


git pull origin master
build



while :			#continuously check for internet
do
   {
   		sleep $checktime
   		git pull origin master
   }
done