Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});

Photos = new Mongo.Collection('photos');
Dogs = new Mongo.Collection('dogs');
Races = new Mongo.Collection('races');
Places = new Mongo.Collection('places');