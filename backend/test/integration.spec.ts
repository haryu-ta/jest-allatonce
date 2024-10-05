import request from "supertest";
import fs from "fs";
import { createApp } from "../src/app";
import express from "express";
import { Expense } from "../src/type";

const GROUP_FILE_PATH = "../data/integration/groups.json";
const EXPENSE_FILE_PATH = "../data/integration/expenses.json";

const getGroups = () => {
  return [
      {
        name: "Pirates",
        members: ["Kobayashi", "Mizuhara", "Suzuki", "Nakabayashi"],
      },
      {
        name: "FightClub",
        members: ["Sasaki", "Takizawa", "Date", "Takamiya"],
      },
  ]
};

const getExpenses = () => {
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

describe("Integration test",() => {
    let app : express.Express;

    beforeEach(() => {
        fs.writeFileSync(GROUP_FILE_PATH,JSON.stringify(getGroups()));
        fs.writeFileSync(EXPENSE_FILE_PATH,JSON.stringify(getExpenses()));

        app = createApp(GROUP_FILE_PATH,EXPENSE_FILE_PATH);
    });

    test("Get /groups",async () => {
        const response = await request(app).get("/groups");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(getGroups());
    })

    test("Post /expenses",async () => {
        const body:Expense = {
            groupName: "Pirates",
            expenseName: "祝勝会",
            payer: "Mizuhara",
            amount: 1000
        }
        const response = await request(app).post("/expenses").send(body);
        expect(response.status).toBe(200);
        expect(response.text).toEqual("支出が登録されました");

        const result = fs.readFileSync(EXPENSE_FILE_PATH,{encoding:"utf-8"});
        expect(result).toEqual(JSON.stringify([...getExpenses(),body]));

    })
})