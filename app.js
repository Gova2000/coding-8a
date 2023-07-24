const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
app.use(express.json());
const path = require("path");

let db = null;
const pathFix = path.join(__dirname, "todoApplication.db");
const conArray = async () => {
  try {
    db = await open({
      filename: pathFix,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("This Server running at http://localhost:3001");
    });
  } catch (e) {
    console.log(`DB ERROR ${e.message}`);
  }
};

conArray();

//get all query based url
app.get("/todos/", async (request, response) => {
  const { status = "" } = request.query;
  const repo = `
    select*from 
    todo
    where 
    
    status like '%${status}%'
    
    ;`;
  const Getting = await db.all(repo);
  response.send(Getting);
});

app.get("/todos/", async (request, response) => {
  const { priority = "" } = request.query;
  const repo = `
    select*from 
    todo
    where 
    priority like '%${priority}%'
    
    ;`;
  const Getting = await db.all(repo);
  response.send(Getting);
});

app.get("/todos/", async (request, response) => {
  const { priority = "", status = "" } = request.query;
  const repo = `
    select*from 
    todo
    where 
    priority like '%${priority}%'
    status like '%${status}%'
    
    ;`;
  const Getting = await db.all(repo);
  response.send(Getting);
});

app.get("/todos/", async (request, response) => {
  const { search_q = "" } = request.query;
  const repo = `
    select*from 
    todo
    where 
    
    title like '%${search_q}%'
    ;`;
  const Getting = await db.all(repo);
  response.send(Getting);
});

//API get based on ID
app.get("/todos/:todoId/", async (response, request) => {
  const { todoId } = request.params;
  const apps = `
    SELECT*FROM
    todo
    WHERE id=${todoId};`;
  const ap = await db.get(apps);
  response.send(ap);
});

//create new id
app.post("/todos/", async (request, response) => {
  const keep = request.body;
  const { id, todo, priority, status } = keep;
  const addObj = `
    INSERT INTO
    todo(id,todo,priority,status)
    VALUES
    (
        ${id},
        '${todo}',
        '${priority}',
        '${status}'
    );`;
  await db.run(addObj);

  response.send("Todo Successfully Added");
});

//Update todo based on ID
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const Upd = request.body;
  const { status } = Upd;
  const IdUpdate = `
    UPDATE todo
    SET
    status='${status}'
    WHERE 
    id=${todoId};`;
  await db.run(IdUpdate);
  response.send("Status Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const Upd3 = request.body;
  const { priority } = Upd3;
  const IdUpdate3 = `
    UPDATE todo
    SET
    priority='${priority}'
    WHERE 
    id=${todoId};`;
  await db.run(IdUpdate3);
  response.send("Priority Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const Upd2 = request.body;
  const { todo } = Upd2;
  const IdUpdate2 = `
    UPDATE todo
    SET
    todo='${todo}'
    WHERE 
    id=${todoId};`;
  await db.run(IdUpdate2);
  response.send("Todo Updated");
});

//delete todo based on ID
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const DltId = `
    DELETE FROM todo
     WHERE 
    id=${todoId};`;
  await db.run(DltId);
  response.send("Todo Deleted");
});

module.exports = app;
