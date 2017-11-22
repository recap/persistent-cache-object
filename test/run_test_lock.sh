#!/bin/bash

rm map.db 2>/dev/null

ITERATIONS=100

echo "launching $ITERATIONS processes";

for (( i=1; i<=$ITERATIONS; i++ ))
do
	node ./test/lockQWEPLO.js $i &
done

DONE=false;

while [ $DONE = false ];
do
	RUNNING=`ps aux | grep lockQWEPLO | grep -v grep | awk '{print $2}'`;
	if [ -z "$RUNNING" ];
	then
		DONE=true;
		OUT=`node ./test/report.js`;
		if [ $OUT = $ITERATIONS ];
		then
			echo "pass";
		else
			echo "fail";
		fi
	else
		DONE=false;
	fi
	sleep 1;
done
