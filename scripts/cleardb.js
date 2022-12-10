const Database = require("@replit/database")
const db = new Database()
db.list().then(keys => {
  console.log(keys);
  return Promise.all(keys.map(x=>db.delete(x)));
});
