const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./module/replaceTemplate');

/** example Syncronius  */
// const textIn = fs.readFileSync(
//   "./../complete-node-bootcamp-master/1-node-farm/starter/txt/input.txt",
//   "utf-8"
// );
// console.log(textIn)
// const textOut = `This is what you know about avocado ${textIn}. \nCreated on ${Date.now()}`
// fs.writeFileSync('./../complete-node-bootcamp-master/1-node-farm/starter/txt/input.txt', textOut)

// console.log('File Written')

/** Aync example */
// fs.readFile(
//   "./../complete-node-bootcamp-master/1-node-farm/starter/txt/start.txt",
//   "utf8",
//   (err, data1) => {
//     if (err) return console.log("ERROR");
//     fs.readFile(
//       `./../complete-node-bootcamp-master/1-node-farm/starter/txt/${data1}.txt`,
//       "utf-8",
//       (err, data2) => {
//         console.log(data2, "data2");
//         fs.readFile(
//           `./../complete-node-bootcamp-master/1-node-farm/starter/txt/append.txt`,
//           "utf-8",
//           (err, data3) => {
//             console.log(data3, "data2");

//             fs.writeFile(
//               "./../complete-node-bootcamp-master/1-node-farm/starter/txt/final.txt",
//               `${data2}\n${data3} `,
//               "utf-8",
//               (err) => {
//                 console.log(`Your file has been written`);
//               }
//             );
//           }
//         );
//       }
//     );
//   }
// );

// console.log("Will read file");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName), { lower: true });
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // product overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);

    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // product API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
