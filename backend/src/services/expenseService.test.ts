import { ExpenseService } from "./expenseService";
import { GroupService } from "./groupService";
import { ExpenseRepository } from "../repositories/expenseRepository";
import { Expense, Group, Settlement } from "../type";
import { GroupRepository } from "../repositories/groupRepository";
import * as SettlementClass from "../utils/settlements";

// 標準的なExpense返却
const getExpense = () => {
  return [
    {
      groupName: "Pirates",
      expenseName: "祝勝会",
      payer: "Kobayashi",
      amount: 1000,
    },
    {
      groupName: "Pirates",
      expenseName: "決起会",
      payer: "Mizuhara",
      amount: 9000,
    },
  ];
};

const getGroup = () => {
  return {
    name: "Pirates",
    members: ["Kobayashi", "Mizuhara", "Suzuki", "Nakabayashi"],
  };
};

describe("expenseServiceのテスト", () => {
  let repo: ExpenseRepository;
  let groupService: GroupService;
  let piratesExpense: Expense[];
  let piratesGroup: Group;
  describe("getSettlementsのテスト", () => {
    beforeEach(() => {
      repo = new ExpenseRepository("file.json");
      groupService = new GroupService(new GroupRepository("file.json"));
      piratesExpense = getExpense();
      piratesGroup = getGroup();
    });

    test("異常系_Group存在なし", () => {
      const getGroupFn = jest.spyOn(groupService, "getGroupByName");
      getGroupFn.mockImplementation((_) => undefined);
      const cls = new ExpenseService(repo, groupService);
      expect(() => cls.getSettlements("Pirates")).toThrow();
      expect(() => cls.getSettlements("Pirates")).toThrow(
        `グループ： Pirates が存在しません`
      );
      expect(getGroupFn).toHaveBeenCalledWith("Pirates");
    });

    test("正常系", () => {
      // データ準備
      const loadFn = jest.spyOn(repo, "loadExpenses");
      const testExpense = [...piratesExpense];
      loadFn.mockImplementation(() => {
        // フィルター外追加
        testExpense.push({
          groupName: "FightClub",
          expenseName: "忘年会",
          payer: "Sasaki",
          amount: 2000,
        });
        return testExpense;
      });
      const getGroupFn = jest.spyOn(groupService, "getGroupByName");
      const testGroup = { ...piratesGroup };
      getGroupFn.mockImplementation((_) => testGroup);
      // 引数を確認したいのでMockか
      const calcFn = jest.spyOn(SettlementClass, "calculateSettlements");
      // テスト対象のインスタンスか
      const cls = new ExpenseService(repo, groupService);
      // 予測結果
      const expectExpense: Settlement[] = [
        {
          from: "Kobayashi",
          to: "Mizuhara",
          amount: 1500,
        },
        {
          from: "Suzuki",
          to: "Mizuhara",
          amount: 2500,
        },
        {
          from: "Nakabayashi",
          to: "Mizuhara",
          amount: 2500,
        },
      ];
      expect(cls.getSettlements("Pirates")).toEqual(expectExpense);
      expect(calcFn).toHaveBeenCalledTimes(1);
      expect(calcFn).toHaveBeenCalledWith(piratesExpense, piratesGroup.members);
      calcFn.mockClear();
    });

    test("正常系_会計なし", () => {
      // データ準備
      const loadFn = jest.spyOn(repo, "loadExpenses");
      const testExpense: Expense[] = [];
      loadFn.mockImplementation(() => {
        // フィルター外追加
        testExpense.push({
          groupName: "FightClub",
          expenseName: "忘年会",
          payer: "Sasaki",
          amount: 2000,
        });
        return testExpense;
      });
      const getGroupFn = jest.spyOn(groupService, "getGroupByName");
      const testGroup = { ...piratesGroup };
      getGroupFn.mockImplementation((_) => testGroup);
      // 引数を確認したいのでMockか
      const calcFn = jest.spyOn(SettlementClass, "calculateSettlements");
      // テスト対象のインスタンスか
      const cls = new ExpenseService(repo, groupService);
      // 予測結果
      const expectExpense: Settlement[] = [];
      expect(cls.getSettlements("Pirates")).toEqual(expectExpense);
      expect(calcFn).toHaveBeenCalledTimes(1);
      expect(calcFn).toHaveBeenCalledWith([], piratesGroup.members);
    });
  });
  describe("addExpenseのテスト", () => {
    beforeEach(() => {
      repo = new ExpenseRepository("file.json");
      groupService = new GroupService(new GroupRepository("file.json"));
      piratesExpense = getExpense();
      piratesGroup = getGroup();
    });

    test("異常系", () => {
      const groupFn = jest.spyOn(groupService, "getGroupByName");
      groupFn.mockImplementation((_) => {
        return undefined;
      });
      const cls = new ExpenseService(repo, groupService);
      expect(() => cls.addExpense(getExpense()[0])).toThrow();
      expect(() => cls.addExpense(getExpense()[0])).toThrow(
          `グループ： Pirates が存在しません`
        );
    });
    
    test("異常系2", () => {
        const groupFn = jest.spyOn(groupService, "getGroupByName");
        const groupinfo = getGroup();
        groupFn.mockImplementation((_) => {
            return groupinfo;
        });
        const paramExpense = {...getExpense()[0],payer:"Sasaki"};
        const cls = new ExpenseService(repo, groupService);
        expect(() => cls.addExpense(paramExpense)).toThrow();
        expect(() => cls.addExpense(paramExpense)).toThrow("支払い者がメンバーの中にいません");
    });

    test("正常系", () => {
        const mockedfn = jest.spyOn(repo,"saveExpense");
        const groupFn = jest.spyOn(groupService, "getGroupByName");
        const groupinfo = getGroup();
        groupFn.mockImplementation((_) => {
            return groupinfo;
        });
        const cls = new ExpenseService(repo,groupService);
        expect(cls.addExpense(getExpense()[0])).toBeUndefined();
        expect(mockedfn).toHaveBeenCalledTimes(1);
        expect(mockedfn).toHaveBeenCalledWith(getExpense()[0]);
    })
  });
});
