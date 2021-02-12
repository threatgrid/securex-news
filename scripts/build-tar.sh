#!/bin/bash

echo {\"gitBranch\": \"$(git rev-parse --abbrev-ref HEAD)\", \
              \"gitHash\": \"$(git rev-parse --verify HEAD)\", \
              \"timestamp\": \"$(date -u)\"}

touch securex-news.tar.gz
tar --exclude=securex-news.tar.gz -czf securex-news.tar.gz .
