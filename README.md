# backend

## Controller(Expressのモック化)

```javascript
import express from "express";

describe("Controllerのテスト", () => {
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: Partial<express.NextFunction>;
  beforeEach(() => {
    // Requestをモック化
    req = {
      params: {name:"param1"},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  test("test",() => {
    const controller = new Controller();
    controller.method(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({name: "Pirates"});
  });
})
```

## SuperTest(IntegrationTest)

```
npm i -D supertest
```

```javascript
import request from "supertest";
import { createApp } from "../src/app";
import express from "express";

describe("Integration test",() => {
  let app : express.Express;

  beforeEach(() => {
    app = createApp();
  })

  test("Get", async() => {
    const response = await request(app).get("/get");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{name:"Pirates"},{name:"FightClub"}]);
  })

test("Post", async() => {
    const response = await request(app).post("/post").send(body);
    expect(response.status).toBe(200);
    expect(response.text).toEqual("登録完了");
  })
});
```

# frontend

## playwrigtht

```
npm init playwright@latest
```


# TODO
- [ ] playwright記法
- [ ] snapshotの取得方法