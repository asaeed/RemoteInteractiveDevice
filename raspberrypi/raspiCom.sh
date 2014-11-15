#!/bin/sh

line=$(ps -e | grep python)
if [ x"$line" = x ]; then
    python /home/pi/projects/remoteDevice/raspberrypi/robot.py
fi

