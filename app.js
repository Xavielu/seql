const express = require("express");
const bodyParser = require("body-parser");
// const Sequelize = require("sequelize");
const Playlist = require("./models/playlist");
const Artist = require("./models/artist");
const Album = require("./models/album");
const Track = require("./models/track");
const sequelize = require("./database/sequelize");
const artist = require("./models/artist");
// const { ForeignKeyConstraintError } = require("sequelize");

const port = 8000;

const { Op } = sequelize;

const app = express();
app.use(bodyParser.json());
Artist.hasMany(Album, {
  foreignKey: "ArtistId",
});
Album.belongsTo(Artist, {
  foreignKey: "ArtistId",
});
Playlist.belongsTo(artist, {
  foreignKey: "ArtistId",
});

Playlist.belongsToMany(Track, {
  through: "playlist_track",
  foreignKey: "PlaylistId",
  timestamps: false,
});

Track.belongsToMany(Playlist, {
  through: "playlist_track",
  foreignKey: "TrackId",
  timestamps: false,
});

app.delete("/api/playlists/:id", function (request, response) {
  let { id } = request.params;
  Playlist.findByPk(id)
    .then(() => {
      if (playlist) {
        return playllist.setTracks([]).then(() => {
          return playlist.destroy().then(()=> {
            response.status(204).send()
          })
        });
      }else {
        response.status(404).send();
      }
    })
    // .then(() => {
    //   response.status(204).send();
    // },() => {
    //   response.status(404).send();
    // } );
});

app.post("/api/artists", function (request, response) {
  Artist.create({
    name: request.body.name,
  }).then((artist) => {
    response.json(artist);
  });
});

app.get("/api/playlists", function (request, response) {
  let filter = {};
  let { q } = request.query;

  if (q) {
    filter = {
      where: {
        name: {
          [Op.like]: `${q}%`,
        },
      },
    };
  }
  Playlist.findAll(filter).then((playlists) => {
    response.json(playlists);
  });
});
app.get("/api/artists", function (request, response) {
  Artist.create({
    name: request.body.name,
  }).then(
    (artist) => {
      response.json(artist);
    },
    (validation) => {
      response.status(422).json({
        errors: validation.errors.map((error) => {
          return {
            attribute: error.path,
            message: error.message,
          };
        }),
      });
    }
  );
});
app.get("/api/playlists/:id", function (request, response) {
  let { id } = request.params;

  Playlist.findByPk(id, {
    include: [Track],
  }).then((playlists) => {
    if (playlist) {
      response.json(playlists);
    } else {
      response.status(404).send();
    }
  });
});

app.get("/api/Tracks/:id", function (request, response) {
  let { id } = request.params;

  Track.findByPk(id, {
    include: [Playlist],
  }).then((track) => {
    if (track) {
      response.json(track);
    } else {
      response.status(404).send();
    }
  });
});

app.get("/api/artists/:id", function (request, response) {
  let { id } = request.params;

  Artist.findByPk(id, {
    include: [Album],
  }).then((artist) => {
    if (artist) {
      response.json(artist);
    } else {
      response.status(404).send();
    }
  });
});

app.get("/api/albums/:id", function (request, response) {
  let { id } = request.params;

  Album.findByPk(id, {
    include: [Artist],
  }).then((album) => {
    if (album) {
      response.json(album);
    } else {
      response.status(404).send();
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
