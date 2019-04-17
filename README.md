# Mini Systemd SystemCtl + JournalCtl GUI

![screenshot](https://user-images.githubusercontent.com/296551/56261305-87c33400-60a8-11e9-9cb2-2e31a45f8aff.png)

## config for server
```
#so journalctl -a doesnt require sudo permissions:

sudo usermod -a -G systemd-journal <user-name>
```


## developing

```
#install deps
yarn 

#make some changes, then run electron app

yarn run

#package & distribute w/ electron-packager
yarn run pack
yarn run dist
```

