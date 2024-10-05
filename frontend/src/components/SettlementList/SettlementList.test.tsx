import { render,screen } from "@testing-library/react";
import SettlementList from "./SettlementList";
import { Settlement } from "../../type";


test("SettlementList",() => {
    const settlement : Settlement = {
        from: "Mizuhara",
        to: "Kobayashi",
        amount: 10000
    }
    render(<SettlementList settlements={[settlement]}/>);
    expect(screen.getByText("清算方法")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(1)
    expect(screen.getByText("Mizuhara → Kobayashi")).toBeInTheDocument();
    expect(screen.getByText("10000円")).toBeInTheDocument();
})
test("SettlementList2",() => {
    const settlement : Settlement[] = [
        {
            from: "Mizuhara",
            to: "Kobayashi",
            amount: 10000
        },
        {
            from: "Mizuhara",
            to: "Suzuki",
            amount: 50000
        }
    ];
    const { container } = render(<SettlementList settlements={settlement}/>);
    expect(container).toMatchSnapshot();
    expect(screen.getByText("清算方法")).toBeInTheDocument();
    expect(screen.getAllByText("清算方法").length).toBe(1);
    expect(screen.getAllByRole("listitem").length).toBe(2)
    expect(screen.getByText("Mizuhara → Kobayashi")).toBeInTheDocument();
    expect(screen.getByText("Mizuhara → Suzuki")).toBeInTheDocument();
    expect(screen.getByText("10000円")).toBeInTheDocument();
    expect(screen.getByText("50000円")).toBeInTheDocument();
})