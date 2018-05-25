#!/bin/bash

tmp=`mktemp`
tmp2=`mktemp`

sed "s/%ID%/$1/" request1 > $tmp

wget -q --post-file $tmp --header="Content-Type: text/xml" "https://isir.justice.cz:8443/isir_public_ws/IsirWsPublicService" -O $tmp2

xsltproc soap1csv.xslt $tmp2
