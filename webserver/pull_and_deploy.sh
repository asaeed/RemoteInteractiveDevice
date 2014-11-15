DEPLOY_PATH="/home/ec2-user/apps/remoteDevice"
TEMP_PATH="/home/ec2-user/apps/remoteDeviceTemp"
GIT_REPO_URL="https://labsmb_deployments:lAbsmb123@bitbucket.org/mcgarrybowen/labs-remote-interactive-device.git"

#echo "Are you sure you want to deploy this code?"
#select yn in "Yes" "No"; do
#        case $yn in
#                Yes )
                        echo "Deployment script started with the following parameters:";
                        echo "DEPLOY_PATH: "$DEPLOY_PATH;
                        echo "TEMP_PATH: "$TEMP_PATH;
                        echo "GIT_REPO_URL: "$GIT_REPO_URL;

                        echo "Start with empty deploy directory...";
                        rm -rf $TEMP_PATH;
						mkdir $TEMP_PATH;

                        echo "Change to deploy directory...";
                        cd $TEMP_PATH;

                        echo "Clone the repo...";
                        git clone $GIT_REPO_URL .;
						#cp -r $DEPLOY_PATH/node_modules $TEMP_PATH/node_modules
						
                        echo "Rsync the contents of the deployment subdirectory to the live project root...";
                        rsync -avz -r --delete --filter='P node_modules' $TEMP_PATH/* $DEPLOY_PATH
						
						echo "Delete temp directory..."
						rm -rf $TEMP_PATH;

                        echo "Make sure the permissions are set up correctly..."
                        chmod -R 755 $DEPLOY_PATH

                        echo "Restarting Node...";
						cd $DEPLOY_PATH/webserver
						./node_modules/forever/bin/forever stop server.js
						./node_modules/forever/bin/forever stop server-stream.js
						
						./node_modules/forever/bin/forever start -ao out.log -ae err.log server.js
						./node_modules/forever/bin/forever start -ao out.log -ae err.log server-stream.js hoopla

#                        echo "Deployment finished. Exiting..."; exit;;
#                No ) echo "No deployment performed. Exiting..."; exit;;
#        esac
#done
