#!/bin/bash
ARGS=""

for arg in "$@"
do
    ARGS+="$arg "
done

yarn firebase emulators:exec --only database "react-scripts test --runInBand --env=jsdom-fourteen $ARGS"
