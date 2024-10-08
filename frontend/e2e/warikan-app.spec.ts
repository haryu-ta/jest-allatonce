import { test,expect } from "@playwright/test";
import axios from "axios";

test.describe("割り勘アプリ",() => {
    test.beforeEach(async({page}) => {
        await axios.get("http://localhost:3000/init");
        await page.goto("http://localhost:3001")
    })

    test.describe("CreateGroup", () => {
        test("グループが作成され動画作成ページに遷移する",async ({page}) => {
            const groupNameElm = page.getByLabel("グループ名");
            await groupNameElm.fill("Pirates");
            const membersElm = page.getByLabel("メンバー");
            await membersElm.fill("Kobayashi,Mizuhara,Suzuki,Nakabayashi");
            
            const buttonElm = page.getByRole("button");
            await buttonElm.click();
            
            await expect(page).toHaveURL(/http:\/\/.+\/group\/Pirates/)
        })
        
        test("バリデーションチェックでNG",async ({page}) => {
            const groupNameElm = page.getByLabel("グループ名");
            await groupNameElm.fill("");
            const membersElm = page.getByLabel("メンバー");
            await membersElm.fill("Kobayashi,Mizuhara,Suzuki,Nakabayashi,Suzuki");
    
            const buttonElm = page.getByRole("button");
            await buttonElm.click();
    
            // エラーメッセージが表示
            const ErrorLabelElm = page.getByText("グループ名は必須です");
            const ErrorLabel2Elm = page.getByText("メンバー名が重複しています");
            expect(ErrorLabelElm).toHaveCount(1);
            expect(ErrorLabel2Elm).toHaveCount(1);
    
            // 次ベージに遷移しない
            await expect(page).toHaveURL("http://localhost:3001");
    
        })
    })

    test.describe("支出登録ページ",() => {
        test("正常に登録できる",async ({page}) => {
            await page.getByLabel("グループ名").fill("Pirates");
            await page.getByLabel("メンバー").fill("Kobayashi,Mizuhara,Suzuki,Nakabayashi");
            await page.getByRole("button").click();

            // 次ページ遷移確認
            await expect(page).toHaveURL(/http:\/\/.+\/group\/Pirates/)

            const settleMethodElm = page.getByText("清算方法");
            expect(settleMethodElm).toHaveCount(1);
            
            // 支出登録
            const expenseElm = page.getByLabel("支出名");
            const amountElm = page.getByLabel("金額");
            const paymentMemberElm = page.getByLabel("支払うメンバー");
            
            await expenseElm.fill("祝勝会");
            await amountElm.fill("2000");
            await paymentMemberElm.selectOption("Kobayashi");
            
            const buttonElm = page.getByRole("button");
            await buttonElm.click();
            
            // 清算方法表示
            expect(settleMethodElm).toBeVisible();
            
            // 検証
            const listElems = page.getByRole("listitem");
            expect(listElems).toHaveCount(3);
            expect(listElems.filter({hasText:"Mizuhara → Kobayashi"})).toHaveText("Mizuhara → Kobayashi500円");
            expect(listElems.filter({hasText:"Suzuki → Kobayashi"})).toHaveText("Suzuki → Kobayashi500円");
            expect(listElems.filter({hasText:"Nakabayashi → Kobayashi"})).toHaveText("Nakabayashi → Kobayashi500円");
 
            // クリア確認
            expect(expenseElm).toHaveText("");
            expect(amountElm).toHaveText("");
            //expect(paymentMemberElm).toHaveText("選択してください");
            
            // 再入力
            await expenseElm.fill("決起会");
            await amountElm.fill("10000");
            await paymentMemberElm.selectOption("Mizuhara");

            await buttonElm.click();

            // 検証
            expect(listElems).toHaveCount(3);
            expect(listElems.filter({hasText:"Kobayashi → Mizuhara"})).toHaveText("Kobayashi → Mizuhara1000円");
            expect(listElems.filter({hasText:"Suzuki → Mizuhara"})).toHaveText("Suzuki → Mizuhara3000円")
            expect(listElems.filter({hasText:"Nakabayashi → Mizuhara"})).toHaveText("Nakabayashi → Mizuhara3000円")
        })
    })
})
