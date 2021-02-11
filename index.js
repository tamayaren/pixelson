// pixelson-index
const fs = require("fs-extra");
const jimp = require("jimp");

const readChunk = require("read-chunk");
const imageType = require("image-type");
//
const input = fs.ensureDir("./input");
const output = fs.ensureDir("./output");

const date = new Date().getTime();
const batch = `./output/batch${date}`
fs.ensureDir(batch);

fs.readdir("./input").then(files => {
    files.forEach(file => {
        const buffer = readChunk.sync(`./input/${file}`, 0, 12);
        const translate = imageType(buffer);

        console.log(`Reading: ${file}`);
        if (translate) {
            const path = `${batch}/frame${parseInt(file.slice(5, 9))}.json`
            console.log(`Got: ${translate.ext} | ${translate.mime}`);
            //
            fs.ensureFile(path);

            var data = {};

            console.log(`Created Ensured File: ${path}`)
            jimp.read(`./input/${file}`, function (err, image) {
                if (err) return;
                image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
                    data[image.getPixelIndex(x, y)] = {
                        w: x,
                        h: y,
                        col: jimp.intToRGBA(image.getPixelColor(x, y))
                    };

                    if (x == image.bitmap.width - 1 && y == image.bitmap.height - 1) {
                        console.log(`Writing to file: ${path}`);
                        fs.writeFileSync(path, JSON.stringify(data, null, "\t"));
                        console.log(`Wrote to: ${path}`);
                    }
                })
            })
        }
    })
})