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
const hasStatusAndPri = (req) => {
  return (req.priority !== undefined) & (req.status !== undefined);
};

const hasPriority = (req) => {
  return req.priority !== undefined;
};

const hasStatus = (req) => {
  return req.status !== undefined;
};

app.get("/todos/", async (request, response) => {
  const { status, priority, search_q = "" } = request.query;
  let repo = "";
  switch (true) {
    case hasStatusAndPri(request.query):
      repo = `
    select*from 
    todo
    where 
    todo LIKE '%${search_q}%'
     AND status ='${status}'
     AND priority='${priority}'
    ;`;
      break;

    case hasPriority(request.query):
      repo = `
    select*from 
    todo
    where
    todo LIKE '%${search_q}%'
   AND priority = '${priority}';`;
      break;

    case hasStatus(request.query):
      repo = `
    select*from 
    todo
    where 
    todo LIKE '%${search_q}%' AND
    status ='${status}';`;
      break;
    default:
      repo = `
        select*
        from 
        todo
        where 
        todo LIKE '%${search_q}%';`;
  }
  const Getting = await db.all(repo);
  response.send(Getting);
});

//API get based on ID
app.get("/todos/:todoId/", async (request, response) => {
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
  const reqBody = request.body;
  let upd = "";
  switch (true) {
    case reqBody.status !== undefined:
      upd = "Status";
      break;

    case reqBody.priority !== undefined:
      upd = "Priority";
      break;
    case reqBody.todo !== undefined:
      upd = "Todo";
      break;
  }
  const PreTodo = `
  SELECT
  *
  FROM
    todo
  WHERE
    id=${todoId};`;

  const pre = await db.get(PreTodo);
  const {
    todo = pre.todo,
    priority = pre.priority,
    status = pre.status,
  } = reqBody;

  const upReq = `
  UPDATE
  todo
  SET
    todo='${todo}',
    priority='${priority}',
    status='${status}'
  WHERE
  id=${todoId};`;
  await db.run(upReq);
  response.send(`${upd} Updated`);
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
