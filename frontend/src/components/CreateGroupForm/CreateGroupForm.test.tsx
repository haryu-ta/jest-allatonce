import { render,screen } from "@testing-library/react";
import CreateGroupForm from "./CreateGroupForm";
import userEvent from "@testing-library/user-event";

const onSubmit = jest.fn(async () => {
    return;
})

test("初期表示",() => {
    // const { container } = 
    render(<CreateGroupForm onSubmit={onSubmit}/>);
    //expect(container).toMatchSnapshot();
    expect(screen.getByText("グループ名")).toBeInTheDocument();
    expect(screen.getByText("グループ名").nodeName).toBe("LABEL")
    expect(screen.getByPlaceholderText("旅行")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("旅行").nodeName).toBe("INPUT");
    expect(screen.getByText("グループを作成")).toBeInTheDocument();
    expect(screen.getByText("グループを作成").nodeName).toBe("BUTTON");
    expect(screen.getByText("グループを作成")).not.toBeDisabled();

})

test("入力チェックエラー_メンバー未入力",async () => {
    // const { container } = 
    render(<CreateGroupForm onSubmit={onSubmit}/>);
    const InputElm = screen.getByText("グループ名")
    await userEvent.type(InputElm,"Pirates");
    const buttonElm = screen.getByText("グループを作成");
    await userEvent.click(buttonElm);
    expect(screen.getByText("メンバーは2人以上必要です")).toBeInTheDocument();
})

test("入力チェックエラー_グループ未入力",async () => {
    const { container } = render(<CreateGroupForm onSubmit={onSubmit}/>);
    const InputElm = container.querySelector("#members")!;
    await userEvent.type(InputElm,"Kobayashi,Kobayashi,Mizuhara");
    const buttonElm = screen.getByText("グループを作成");
    await userEvent.click(buttonElm);
    expect(screen.getByText("メンバー名が重複しています")).toBeInTheDocument();
})

test("正常系",async () => {
    const { container } = render(<CreateGroupForm onSubmit={onSubmit}/>);
    const groupInputElm = container.querySelector("#name")!;
    await userEvent.type(groupInputElm,"Pirates");
    const memberInputElm = container.querySelector("#members")!;
    await userEvent.type(memberInputElm,"Kobayashi,Mizuhara");
    const buttonElm = screen.getByText("グループを作成");
    await userEvent.click(buttonElm);
    
    // 呼出確認
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toBeCalledWith({"name":"Pirates","members":["Kobayashi","Mizuhara"]});

    expect(screen.queryByDisplayValue("Pirates")).toBeNull();


})