import { Expense,Settlement } from "../type";
import {calculateSettlements} from "./settlements";


describe("calculateSettlements",() => {
    test("割り切り可能_単数",() => {
        // 入力データ作成
        const InputExpence:Expense[] = [
            {
            
                groupName: "Pirates",
                expenseName: "祝勝会",
                payer: "Kobayashi",
                amount: 2000
            }
        ];
        const groupMembers : string[] = ["Kobayashi","Mizuhara","Suzuki","Nakabayashi"];
        const expectSettlement : Settlement[] = [
            {
                from: "Mizuhara",
                to: "Kobayashi",
                amount: 500
            },
            {
                from: "Suzuki",
                to: "Kobayashi",
                amount: 500
            },
            {
                from: "Nakabayashi",
                to: "Kobayashi",
                amount: 500
            },
        ]
        const settlements : Settlement[] = calculateSettlements(InputExpence,groupMembers);
        expect(settlements).toEqual(expectSettlement);

    });

    test("割り切り不可_単数",() => {
        // 入力データ作成
        const InputExpence:Expense[] = [
            {
            
                groupName: "Pirates",
                expenseName: "祝勝会",
                payer: "Kobayashi",
                amount: 2003
            }
        ];
        const groupMembers : string[] = ["Kobayashi","Mizuhara","Suzuki","Nakabayashi"];
        const expectSettlement : Settlement[] = [
            {
                from: "Mizuhara",
                to: "Kobayashi",
                amount: 500
            },
            {
                from: "Suzuki",
                to: "Kobayashi",
                amount: 500
            },
            {
                from: "Nakabayashi",
                to: "Kobayashi",
                amount: 500
            },
        ]
        const settlements : Settlement[] = calculateSettlements(InputExpence,groupMembers);
        expect(settlements).toEqual(expectSettlement);
    });

    test("割り切り不可_複数",() => {
        // 入力データ作成
        const InputExpence:Expense[] = [
            {
                groupName: "Pirates",
                expenseName: "祝勝会",
                payer: "Kobayashi",
                amount: 1000
            },
            {
                groupName: "Pirates",
                expenseName: "決起会",
                payer: "Mizuhara",
                amount: 9000
            }
        ];
        const groupMembers : string[] = ["Kobayashi","Mizuhara","Suzuki","Nakabayashi"];
        const expectSettlement : Settlement[] = [
            {
                from: "Kobayashi",
                to: "Mizuhara",
                amount: 1500
            },
            {
                from: "Suzuki",
                to: "Mizuhara",
                amount: 2500
            },
            {
                from: "Nakabayashi",
                to: "Mizuhara",
                amount: 2500
            }
        ]
        const settlements : Settlement[] = calculateSettlements(InputExpence,groupMembers);
        expect(settlements).toEqual(expectSettlement);
    });
})
