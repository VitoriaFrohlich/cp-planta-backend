#!/bin/bash

# Regex para validar Conventional Commits
commit_message="$1"
pattern="^(feat|fix|docs|style|refactor|perf|test|chore|build|ci|revert)(\([a-z0-9]+\))?: .+$"

if [[ ! $commit_message =~ $pattern ]]; then
  echo "Commit message does not follow Conventional Commits format!"
  echo "Example: feat: add new login functionality"
  exit 1
fi

echo "Commit message is valid!"
exit 0