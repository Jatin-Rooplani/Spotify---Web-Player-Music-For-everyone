const fs = require("fs");
const path = require("path");

const songsPath = path.join(__dirname, "songs");

const folders = fs.readdirSync(songsPath, {
    withFileTypes: true
})
.filter(item => item.isDirectory())
.map(item => item.name);

fs.writeFileSync(
    path.join(songsPath, "albums.json"),
    JSON.stringify(folders, null, 4)
);

for (const folder of folders) {

    const folderPath = path.join(songsPath, folder);

    const songs = fs.readdirSync(folderPath)
        .filter(file => file.toLowerCase().endsWith(".mp3"));

    fs.writeFileSync(
        path.join(folderPath, "songs.json"),
        JSON.stringify(songs, null, 4)
    );
}

console.log("JSON files generated successfully!");