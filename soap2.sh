#!/bin/bash 

RC=$1
tmp=`mktemp`
tmp2=`mktemp`
tmp3=`mktemp`

sed "s/%RC%/$RC/" request > $tmp

wget -q --post-file $tmp --header="Content-Type: text/xml" "https://isir.justice.cz:8443/isir_cuzk_ws/IsirWsCuzkService" -O $tmp2

xsltproc --verbose soap2csv.xslt $tmp2
