const fs = require("fs-extra");
const replace = require('replace-in-file');

const args = process.argv.slice(2);
const folderNumber = args[0];

const thumbUrl = args[1];
const previewUrl = thumbUrl;
const cubeUrl = thumbUrl.replace(/_f/, '_%s');


// COPY FILE
fs.copy('sku/000', `sku/${folderNumber}`, function (err) {
    if (err) {
        console.log('An error occured while copying the folder.')
        return console.error(err)
    }
    console.log(`https://house-platform.web.app/?xml=sku/${folderNumber}/pano.xml`)

    // REPLACE FILE
    try {
        const option1 = {
            files: `sku/${folderNumber}/pano.xml`,
            from: /\%\$thumbUrl\%/g,
            to: thumbUrl,
        };
        const option2 = {
            files: `sku/${folderNumber}/pano.xml`,
            from: /\%\$previewUrl\%/g,
            to: previewUrl,
        };
        const option3 = {
            files: `sku/${folderNumber}/pano.xml`,
            from: /\%\$cubeUrl\%/g,
            to: cubeUrl,
        };
        replace.sync(option1);
        replace.sync(option2);
        replace.sync(option3);
    }
    catch (error) {
        console.error('Error occurred:', error);
    }

});

