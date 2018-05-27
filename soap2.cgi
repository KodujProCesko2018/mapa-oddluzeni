#!/bin/bash 

tmp=`mktemp`
tmp2=`mktemp`

saveIFS=$IFS
IFS='=&'
parm=($QUERY_STRING)
IFS=$saveIFS

for ((i=0; i<${#parm[@]}; i+=2))
do
    declare var_${parm[i]}=${parm[i+1]}
done

sed -e "s/%VEC%/$var_bcVec/" -e "s/%ROCNIK%/$var_rocnik/" request_soap2.xml > $tmp

echo "Content-Type: text/xml; charset=utf-8;"
echo ""

wget -q --post-file $tmp --header="Content-Type: text/xml" "https://isir.justice.cz:8443/isir_cuzk_ws/IsirWsCuzkService" -O $tmp2

cat $tmp2
