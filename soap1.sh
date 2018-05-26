#!/bin/bash

tmp=`mktemp`
tmp2=`mktemp`
NEXT="-1"

while :
do
    sed "s/%ID%/$NEXT/" request1 > $tmp
    wget -q --post-file $tmp --header="Content-Type: text/xml" "https://isir.justice.cz:8443/isir_public_ws/IsirWsPublicService" -O $tmp2
    NEXT=$(xsltproc soap1csv.xslt $tmp2 | python compress.py)
    echo $NEXT
done
