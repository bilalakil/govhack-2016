## Required settings

Before running Meteor, ensure a `settings.json` exists like so:

```
{
  "public": {
    "googleMapsApiKey": "..",
    "apiUrl": ".."
  },
  "google": {
    "clientId": "..",
    "clientSecret": ".."
  }
}
```

And then run Meteor with `meteor --settings settings.json`.
