#!/bin/sh

echo "run_id: $RUN_ID"
npm test
test_exit_code=$?

npm run report:publish
publish_exit_code=$?

if [ $publish_exit_code -ne 0 ]; then
  echo "failed to publish test results"
  exit $publish_exit_code
fi

# Fail if wdio exited non-zero or wrote the FAILED marker file
if [ $test_exit_code -ne 0 ] || [ -f FAILED ]; then
  echo "test suite failed"
  [ -f FAILED ] && cat ./FAILED
  exit 1
fi

echo "test suite passed"
exit 0
