# SNEL Rain App

## Install for development
```
yarn
```

## Run development
```
yarn develop
```
App will no be available on `localhost:1234`

## Production build and run
```
docker build -t snel-delay-calculator .
docker run -d -p 5000:1234 snel-delay-calculator
```
App will no be available on `localhost:5000`