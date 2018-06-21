# Mini Systemd SystemCtl + JournalCtl GUI



## config for server
```
#so journalctl -a doesnt require sudo permissions:

sudo usermod -a -G systemd-journal <user-name>
```


## developing

```
#install deps
yarn 

#make some changes

#package & distribute w/ electron-packager
yarn run pack
yarn run dist
```

