const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const { type } = require('os')
const PORT ="8001"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

app.use(cors())

  
app.get("/",(req,res)=>{
    res.send("Hello")
})
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    console.log("file recived ")
  
    // Access file details from req.file
    const fileName = req.file.filename;
    const filePath = req.file.path;
    console.log(`filename ${fileName}  filepath ${filePath}`)
    // You can now process or store the file as needed
    // For example, send a response with the file details
    // console.log(req)
    
    const wordsArray = req.body.fields.split(',');
    const Hashmap ={};
    Hashmap["Product Id"]="productId"
    Hashmap["Subcategory"]="subcategory",
    Hashmap["Title"]="title",
    Hashmap["Prices"]="price",
    Hashmap["Popularity"]="popularity",
    Hashmap["Description"]="description"
    Hashmap["Rating"]="rating",
    Hashmap["UTM Source"]="UTM_source",
    Hashmap["UTM Medium"]="UTM_medium"

// Log each word
    console.log(typeof wordsArray)
    console.log(wordsArray)
    await fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file.');
        }

        try {
            const jsonData = JSON.parse(data);
            // console.log(jsonData)
            // Filter the data based on user-specified fields
          
            const transformedData = Object.entries(jsonData.products).map(([productId, productDetails]) => {
                return {
                  productId,
                  subcategory: productDetails.subcategory,
                  title: productDetails.title,
                  price: productDetails.price,
                  popularity: productDetails.popularity,
                  description:"",
                  rating:5,
                  UTM_source:"",
                  UTM_medium:""
        
                };
              });
              const filteredData = transformedData.map((product) => {
                const filteredProduct = {};
                wordsArray.forEach((field) => {
                  if (product.hasOwnProperty(Hashmap[field])) {
                    filteredProduct[field] = product[Hashmap[field]];
                  }
                });
                return filteredProduct;
              });
            // Send the filtered data as the response
            // console.log(transformedData)
            console.log(filteredData)
            res.json({data:filteredData});
        } catch (parseError) {
            res.status(500).send('Error parsing JSON file.');
        }
    })
    // console.log(`Fields recived  are`, fields)
    // res.send(`File uploaded successfully!\nFilename: ${fileName}\nPath: ${filePath}`);
});

app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`)
})