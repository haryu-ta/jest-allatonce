import { Expense } from "../type";
import { ExpenseRepository } from "./expenseRepository";
import fs from "fs";

jest.mock("fs");
const mockedFn = jest.mocked(fs);

describe("expenseRepositoryのテスト", () => {
  describe("loadExpensesのテスト", () => {
    afterEach(() => {
      mockedFn.existsSync.mockClear();
      mockedFn.readFileSync.mockClear();
    });

    test("指定ファイル存在なし", () => {
      mockedFn.existsSync.mockReturnValue(false);
      mockedFn.readFileSync.mockImplementation(() => {
        return "[]";
      });
      const cls = new ExpenseRepository("../data/dev/expenses.json");
      expect(cls.loadExpenses()).toEqual([]);
      expect(mockedFn.existsSync).toHaveBeenCalledTimes(1);
      expect(mockedFn.existsSync).toHaveBeenCalledWith(
        "../data/dev/expenses.json"
      );
      expect(mockedFn.readFileSync).not.toBeCalled();
    });
    test.each([
      { json: "[]" },
      {
        json: '[{"groupName":"テストグループ1","expenseName":"ディナー","payer":"一郎","amount":10000}]',
      },
    ])("指定ファイル存在あり-値有無", ({ json }) => {
      mockedFn.existsSync.mockReturnValue(true);
      mockedFn.readFileSync.mockReturnValue(json);
      const cls = new ExpenseRepository("../data/dev/expenses.json");
      expect(cls.loadExpenses()).toEqual(JSON.parse(json));
      expect(mockedFn.existsSync).toHaveBeenCalledTimes(1);
      expect(mockedFn.existsSync).toHaveBeenCalledWith(
        "../data/dev/expenses.json"
      );
      expect(mockedFn.readFileSync).toHaveBeenCalledTimes(1);
      expect(mockedFn.readFileSync).toHaveBeenCalledWith(
        "../data/dev/expenses.json",
        "utf8"
      );
    });
  });
  describe("saveExpenseのテスト", () => {
    afterEach(() => {
      mockedFn.writeFileSync.mockClear();
      mockedFn.existsSync.mockClear();
      mockedFn.readFileSync.mockClear();
    });
    test("正常系2", () => {
      const expense: Expense = {
        groupName: "Gr1",
        expenseName: "Name",
        payer: "Ichiro",
        amount: 100,
      };
      const expense2: Expense = {
        groupName: "Gr2",
        expenseName: "Name2",
        payer: "Ichiro2",
        amount: 200,
      };
      mockedFn.writeFileSync.mockImplementation(() => {});
      const cls = new ExpenseRepository("../data/dev/expenses.json");
      const loadFn = jest.spyOn(cls, "loadExpenses");
      loadFn.mockReturnValue([expense2]);
      expect(cls.saveExpense(expense)).toBeUndefined();
      expect(loadFn).toHaveBeenCalledTimes(1);
      expect(loadFn).toHaveBeenCalledWith();
      expect(mockedFn.writeFileSync).toHaveBeenCalledTimes(1);
      expect(mockedFn.writeFileSync).toHaveBeenCalledWith(
        "../data/dev/expenses.json",
        JSON.stringify([expense2, expense])
      );
    });
  });
});
