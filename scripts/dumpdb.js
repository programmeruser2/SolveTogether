const Database = require("@replit/database")
const db = new Database()
db.list().then(keys => {
  for (const key of keys) {
    db.get(key).then(val => {
      console.log(key+'='+val)
    })
  }
});
