import express from "express";
import { GroupService } from "../services/groupService";
import { GroupController } from "./groupController";
import { GroupRepository } from "../repositories/groupRepository";

const getGroup = () => {
  return [
    {
      name: "Pirates",
      members: ["Kobayashi", "Mizuhara", "Suzuki", "Nakabayashi"],
    },
    {
      name: "FightClub",
      members: ["Sasaki", "Takizawa", "Date", "Takamiya"],
    },
  ];
};

describe("GroupControllerのテスト", () => {
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: Partial<express.NextFunction>;
  let groupService: GroupService;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    req = {};
    next = jest.fn();
    groupService = new GroupService(new GroupRepository("json.json"));
  });

  test("getGroupListメソッドの正常系テスト", () => {
    const serviceMockFn = jest.spyOn(groupService, "getGroups");
    serviceMockFn.mockReturnValue(getGroup());
    const controller = new GroupController(groupService);
    controller.getGroupList(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(getGroup());
  });

  test("getGroupListメソッドの異常系テスト", () => {
    const serviceMockFn = jest.spyOn(groupService, "getGroups");
    serviceMockFn.mockImplementation(() => {
      throw new Error("Error");
    });
    (next as jest.Mock).mockImplementation((_) => {});
    const controller = new GroupController(groupService);
    controller.getGroupList(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );
    expect(next).toHaveBeenCalled();
  });

  test("getGroupByNameの正常系", () => {
    // Mock化
    const serviceMock = jest.spyOn(groupService, "getGroupByName");
    serviceMock.mockReturnValue(getGroup()[0]);

    req = {
      params: { name: "Pirates" },
    };

    const controller = new GroupController(groupService);
    controller.getGroupByName(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(getGroup()[0]);
    expect(serviceMock).toHaveBeenCalledWith("Pirates");
  });

  test("getGroupByNameの異常系", () => {
    // Mock化
    const serviceMock = jest.spyOn(groupService, "getGroupByName");
    serviceMock.mockReturnValue(undefined);
    req = {
      params: { name: "Pirates" },
    };

    const controller = new GroupController(groupService);
    controller.getGroupByName(
      req as express.Request,
      res as express.Response,
      next as express.NextFunction
    );

    expect(serviceMock).toHaveBeenCalledWith("Pirates");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("グループが存在しません");
  });

  test("addGroupの正常系", () => {
    // Mock化
    req = {
        body: getGroup()[0]
    }
    
    const getGroupMock = jest.spyOn(groupService,"getGroups")
    getGroupMock.mockReturnValue([getGroup()[1]]);
    
    const addGroupMock = jest.spyOn(groupService,"addGroup")
    addGroupMock.mockReturnValue();

    const controller = new GroupController(groupService);

    controller.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
    );

    // 結果判定
    expect(getGroupMock).toHaveBeenCalledTimes(1);
    expect(addGroupMock).toHaveBeenCalledWith(getGroup()[0]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("グループの作成が成功しました");
    
  });

  test("addGroupの入力チェックエラー", () => {
    // Mock化
    req = {
        body: {name: "",members:["Kobayashi","Mizuhara","Suzuki"]}
    }
    
    const getGroupMock = jest.spyOn(groupService,"getGroups")
    getGroupMock.mockReturnValue([getGroup()[1]]);

    const controller = new GroupController(groupService);

    controller.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
    );

    // 結果判定
    expect(getGroupMock).toHaveBeenCalledTimes(0);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(["グループ名は必須です"]);
    
  });
});
