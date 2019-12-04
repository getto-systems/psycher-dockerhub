#!/bin/bash

git remote add super https://getto-systems:$GITLAB_ACCESS_TOKEN@gitlab.com/getto-systems-base/psycher/dockerhub.git
git remote add maint https://getto-systems:$GITHUB_ACCESS_TOKEN@github.com/getto-systems/psycher-dockerhub.git
git tag $(cat .release-version)
git push super HEAD:master --tags
git push maint HEAD:master --tags
git push maint HEAD:maintenance -f