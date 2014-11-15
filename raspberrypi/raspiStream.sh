#!/bin/sh

# if there is an rtmp server to feed to
#raspivid -t -1 -w 320 -h 240 -fps 15 -vf -o - | avconv -i pipe:0 -vcodec copy -an -f flv -metadata stream=labmsmb http://livestream.labsmb.com:8082/hoopla/320/240/

# for use with jsmpeg node package which requires mpeg1video
#raspivid -n -t 9999999 -fps 15 -vf -w 320 -h 240 -o - | ffmpeg -f h264 -i pipe:0 -f mpeg1video -b 200k -r 25 http://livestream.labsmb.com:8082/hoopla/320/240/

# set path for ffmpeg lib
#export LD_LIBRARY_PATH=/usr/lib/
#export LD_LIBRARY_PATH=/usr/src/ffmpeg/
#export LD_LIBRARY_PATH=/usr/local/lib ffmpeg

line=$(ps -e | grep raspivid)
if [ x"$line" = x ]; then
    raspivid -n -t 9999999 -fps 15 -vf -hf -w 320 -h 240 -o - | /usr/src/ffmpeg/ffmpeg -report -f h264 -i pipe:0 -f mpeg1video -b 200k -r 25 http://livestream.labsmb.com:8082/hoopla/320/240/
fi
