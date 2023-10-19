const app = require("./main");

const { readCSV } = require("./services/userService");


readCSV().then(() => {
  app.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
})
}).catch((error) =>{
  console.error('Error synchronizing database:', error);
});

