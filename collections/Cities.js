Cities = new Mongo.Collection('cities');

Cities.allow({
  insert: function() {
    return true;
  }
});

PositionSchema = new SimpleSchema({
  lat: {
    type: Number,
    decimal: true,
    label: "Latitude"
  },
  lng: {
    type: Number,
    decimal: true,
    label: "Longitude"
  }
})

CitySchema = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  country: {
    type: String,
    label: "CountryName"
  },
  coords: {
    type: PositionSchema,
    label: "CountryCoords"

  },
  photoUrl: {
    type: String,
    label: "url"
  },
  description: {
    type: String,
    label: "Description",
    autoValue: function() {
      return 'bla';
    }
  }
})

Cities.attachSchema(CitySchema);
