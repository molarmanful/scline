#!/bin/bash -e

[ -d /jail ] || mkdir /jail
useradd -M -s /bin/false jail

for f in /{etc,root,var,boot,dev,home,tmp}; do
    setfacl -m u:jail:- "$f" || :
done

sclin -e '"hello world"n>o'
