#!/bin/bash

# print outputs and exit on first failure
set -xe

if [ $TRAVIS_BRANCH == "master" ] ; then

    eval "$(ssh-agent -s)" #start the ssh agent
    ssh-add ~/.ssh/travis_rsa
    git remote add deploy "travis@webhost.planecq.xyz:/var/www/planecq.com"
    git push -f deploy master

else

    echo "No deploy script for branch '$TRAVIS_BRANCH'"

fi
