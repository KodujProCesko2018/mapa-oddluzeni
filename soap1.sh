#!/bin/bash

cd /home/xbaisa/src/mapa-oddluzeni
DATAPATH=/mnt/toad1_scratch/xbaisa/isir
tmp=`mktemp`
tmp2=`mktemp`
echo "WHATEVER" > $tmp2
NUM=$(ls -1q $DATAPATH/records*.csv | wc -l)
NNUM=$((NUM+1))
NNNUM=$(printf "%03d" $NNUM)
LAST=$(tail -n1 -q $DATAPATH/records*.csv | cut -f1 | sort -rn | head -n1)
FIRST=$LAST

FILENAME="records_"$NNNUM"_from_"$LAST".csv"
touch $DATAPATH/$FILENAME

while [ -s $tmp2 ]
do
    sed "s/%ID%/$LAST/" request1 > $tmp
    wget -q --post-file $tmp --header="Content-Type: text/xml" "https://isir.justice.cz:8443/isir_public_ws/IsirWsPublicService" -O $tmp2
    if [ ! -s $tmp2 ]; then
        break
    fi
    LAST=$(xsltproc soap1csv.xslt $tmp2 | python compress.py $DATAPATH/$FILENAME)
    echo -n $LAST" "
done

echo "Downloaded records #"$FIRST"-"$LAST" to "$DATAPATH"/"$FILENAME
