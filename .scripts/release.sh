#!/bin/bash
set -ev

if [[ $TRAVIS_PULL_REQUEST = "true" ]]; then
  echo 'This is a pull request. Exiting the release script.'

  exit 0
fi

if [[ $TRAVIS_BRANCH != "master" ]]; then
  echo 'This is not a master branch. Exiting the release script.'

  exit 0
fi

if [[ $TRAVIS_TAG != "" ]]; then
  echo 'This is a tag release.'

  # Use NPM_TOKEN to enable NPM authentication
  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc

  NODE_ENV=development npm install
  NODE_ENV=production npm run build

  npm publish
  exit 0
fi

if [[ $(git log --format=%B -n 1 $TRAVIS_COMMIT) == *"chore: release"* ]]; then
  echo 'This is a tag release. Exiting the release script.'

  exit 0
fi;

git config --global user.name 'continuous-deployment'
git config --global user.email 'continuous-deployment@travis'

# Use GITHUB_TOKEN to enable GitHub authentication
git config credential.helper "store --file=.git/credentials"
echo "https://${GITHUB_TOKEN}:@github.com" > .git/credentials

git checkout master
git merge $TRAVIS_COMMIT

# 1. bump the package.json version (based on your commit history)
# 2. update CHANGELOG.md
# 3. commit package.json and CHANGELOG.md
# 4. tag the release
standard-version --message "chore: release %s"

git push --follow-tags origin master
