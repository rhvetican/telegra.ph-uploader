const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', async (req, res) => {
    const imageUrl = req.body.imageUrl;

    try {
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream',
        });

        const tempFilePath = path.join('/tmp', 'temp.jpg');
        const writer = fs.createWriteStream(tempFilePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const form = new FormData();
        form.append('file', fs.createReadStream(tempFilePath), {
            filename: 'temp.jpg',
            contentType: 'image/jpg',
        });
        const uploadResponse = await axios({
            method: 'POST',
            url: 'https://te.legra.ph/upload',
            data: form,
            headers: form.getHeaders(),
        });

        fs.unlinkSync(tempFilePath);

        res.send(`https://te.legra.ph${uploadResponse.data[0].src}`);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});